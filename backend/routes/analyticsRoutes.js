const router = require('express').Router();
const MealPlan = require('../models/MealPlan');
const Inventory = require('../models/Inventory');
const WasteLog = require('../models/WasteLog');
const { calculateProcurement, startOfDay, endOfDay } = require('../utils/calculations');
const { getDemandPrediction } = require('../services/demandPredictionService');

function dayKey(date) { const value = new Date(date); return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`; }
function recentDays(days = 7) {
  return Array.from({ length: days }, (_, index) => {
    const date = startOfDay(); date.setDate(date.getDate() - (days - index - 1));
    return { date, key: dayKey(date), label: date.toLocaleDateString('en-IN', { weekday: 'short' }) };
  });
}

router.get('/', async (req, res, next) => {
  try {
    const days = recentDays();
    const rangeStart = days[0].date;
    const rangeEnd = endOfDay();
    const targetDate = new Date(); targetDate.setDate(targetDate.getDate() + 1); targetDate.setHours(0, 0, 0, 0);
    const targetDateText = dayKey(targetDate);
    const targetMealType = 'Lunch';
    const [meals, wasteLogs, inventory, targetMeals, prediction] = await Promise.all([
      MealPlan.find({ date: { $gte: rangeStart, $lt: rangeEnd } }).select('date expectedStudents'),
      WasteLog.find({ date: { $gte: rangeStart, $lt: rangeEnd } }).select('date wasteQuantity ingredientName'),
      Inventory.find().sort({ ingredientName: 1 }),
      MealPlan.find({ date: { $gte: startOfDay(targetDate), $lt: endOfDay(targetDate) }, mealType: targetMealType }),
      getDemandPrediction(targetDateText, targetMealType)
    ]);
    const demandTrend = days.map((day) => ({ label: day.label, value: meals.filter((meal) => dayKey(meal.date) === day.key).reduce((sum, meal) => sum + meal.expectedStudents, 0) }));
    const wasteTrend = days.map((day) => ({ label: day.label, value: wasteLogs.filter((log) => dayKey(log.date) === day.key).reduce((sum, log) => sum + log.wasteQuantity, 0) }));
    const lowStockItems = inventory.filter((item) => item.currentQuantity < item.minimumStock);
    const procurement = calculateProcurement(targetMeals, inventory);
    const purchaseItems = procurement.filter((item) => item.status === 'PURCHASE REQUIRED');
    const plannedCapacity = targetMeals.reduce((sum, meal) => sum + meal.expectedStudents, 0);
    const predictedDemand = prediction.available ? prediction.predictedStudents : null;
    const capacityDifference = predictedDemand === null ? null : predictedDemand - plannedCapacity;
    const repeatedWaste = Object.entries(wasteLogs.reduce((totals, log) => { const key = (log.ingredientName || '').trim(); if (key) totals[key] = (totals[key] || 0) + 1; return totals; }, {})).filter(([, count]) => count >= 2);
    const recentWaste = wasteTrend.slice(-3).reduce((sum, day) => sum + day.value, 0);
    const previousWaste = wasteTrend.slice(-6, -3).reduce((sum, day) => sum + day.value, 0);
    const recommendations = [];
    if (capacityDifference > 0) recommendations.push({ type: 'capacity', message: `Increase ${targetMealType.toLowerCase()} preparation capacity by about ${capacityDifference} servings.` });
    purchaseItems.forEach((item) => recommendations.push({ type: 'procurement', message: `Purchase ${item.purchaseRequired} ${item.unit} of ${item.ingredient}.` }));
    repeatedWaste.forEach(([ingredient]) => recommendations.push({ type: 'waste', message: `Review purchasing quantity for ${ingredient}; it appears repeatedly in waste records.` }));
    if (recentWaste > previousWaste && recentWaste > 0) recommendations.push({ type: 'waste', message: 'Waste is trending upward; review meal preparation quantities.' });
    if (!recommendations.length) recommendations.push({ type: 'healthy', message: 'Current plans, stock, and recent waste records need no action.' });

    res.json({
      trends: { demand: demandTrend, waste: wasteTrend },
      inventory: { totalItems: inventory.length, lowStockItems },
      procurement: purchaseItems,
      prediction: { ...prediction, date: targetDateText, mealType: targetMealType, plannedCapacity, capacityDifference },
      recommendations
    });
  } catch (error) { next(error); }
});

module.exports = router;
