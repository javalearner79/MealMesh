const router = require('express').Router();
const MealPlan = require('../models/MealPlan');
const Inventory = require('../models/Inventory');
const WasteLog = require('../models/WasteLog');
const { calculateProcurement, startOfDay, endOfDay } = require('../utils/calculations');

router.get('/', async (req, res, next) => {
  try {
    const today = startOfDay();
    const tomorrow = endOfDay();
    const [todayMeals, inventory, todayWaste, recentWaste] = await Promise.all([
      MealPlan.find({ date: { $gte: today, $lt: tomorrow } }).sort({ mealType: 1 }),
      Inventory.find().sort({ ingredientName: 1 }),
      WasteLog.find({ date: { $gte: today, $lt: tomorrow } }),
      WasteLog.find().sort({ date: -1, createdAt: -1 }).limit(4)
    ]);
    const lowStockItems = inventory.filter((item) => item.currentQuantity < item.minimumStock);
    const procurement = calculateProcurement(todayMeals, inventory);
    const purchaseItems = procurement.filter((item) => item.status === 'PURCHASE REQUIRED');

    res.json({
      metrics: {
        expectedStudents: todayMeals.reduce((sum, meal) => sum + meal.expectedStudents, 0),
        plannedMeals: todayMeals.length,
        plannedServings: todayMeals.reduce((sum, meal) => sum + meal.expectedStudents, 0),
        inventoryItems: inventory.length,
        lowStockItems: lowStockItems.length,
        purchaseItems: purchaseItems.length,
        wasteQuantity: todayWaste.reduce((sum, log) => sum + log.wasteQuantity, 0),
        wasteRecordCount: todayWaste.length
      },
      todayMeals,
      lowStockItems,
      recentWaste,
      purchaseItems
    });
  } catch (error) { next(error); }
});

module.exports = router;
