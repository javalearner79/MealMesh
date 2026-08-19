require('dotenv').config();
const connectDatabase = require('./config/db');
const Inventory = require('./models/Inventory');
const MealPlan = require('./models/MealPlan');
const WasteLog = require('./models/WasteLog');

async function seed() {
  await connectDatabase();
  await Promise.all([Inventory.deleteMany(), MealPlan.deleteMany(), WasteLog.deleteMany()]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  await Inventory.insertMany([
    { ingredientName: 'Rice', currentQuantity: 12, unit: 'kg', minimumStock: 15, supplierName: 'ABC Foods' },
    { ingredientName: 'Rajma', currentQuantity: 9, unit: 'kg', minimumStock: 5, supplierName: 'Fresh Mart' },
    { ingredientName: 'Cooking Oil', currentQuantity: 4, unit: 'l', minimumStock: 3, supplierName: 'Kitchen Supplies' }
  ]);
  const historicalMeals = [
    [-15, 'Breakfast', 'Aloo Paratha', 148], [-14, 'Lunch', 'Dal Roti', 172], [-13, 'Dinner', 'Rajma Rice', 166],
    [-12, 'Breakfast', 'Poha', 151], [-11, 'Lunch', 'Vegetable Pulao', 178], [-10, 'Dinner', 'Chole Rice', 171],
    [-9, 'Breakfast', 'Aloo Paratha', 154], [-8, 'Lunch', 'Dal Roti', 175], [-7, 'Dinner', 'Rajma Rice', 176],
    [-6, 'Breakfast', 'Poha', 149], [-5, 'Lunch', 'Vegetable Pulao', 181], [-4, 'Dinner', 'Chole Rice', 174],
    [-3, 'Breakfast', 'Aloo Paratha', 157], [-2, 'Lunch', 'Dal Roti', 179], [-1, 'Dinner', 'Rajma Rice', 181]
  ].map(([daysAgo, mealType, menu, expectedStudents]) => {
    const date = new Date(today); date.setDate(date.getDate() + daysAgo);
    return { date, mealType, menu, expectedStudents, ingredients: [{ name: 'Rice', quantityPerStudent: 100, unit: 'g' }] };
  });
  await MealPlan.insertMany([...historicalMeals, { date: today, mealType: 'Dinner', menu: 'Rajma Rice', expectedStudents: 180, ingredients: [{ name: 'Rice', quantityPerStudent: 100, unit: 'g' }, { name: 'Rajma', quantityPerStudent: 55, unit: 'g' }] }]);
  await WasteLog.create({ date: today, meal: 'Lunch - Vegetable Pulao', ingredientName: 'Vegetables', preparedQuantity: 180, consumedQuantity: 165, wasteQuantity: 15, wastePercentage: 8.33 });
  console.log('Demo data created.'); process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
