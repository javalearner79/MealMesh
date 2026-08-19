const router = require('express').Router();
const MealPlan = require('../models/MealPlan');
const Inventory = require('../models/Inventory');
const { calculateProcurement, startOfDay, endOfDay } = require('../utils/calculations');

router.get('/', async (req, res, next) => {
  try {
    const selectedDate = req.query.date ? new Date(`${req.query.date}T00:00:00`) : new Date();
    if (Number.isNaN(selectedDate.getTime())) return res.status(400).json({ message: 'Date must use YYYY-MM-DD format.' });
    const meals = await MealPlan.find({ date: { $gte: startOfDay(selectedDate), $lt: endOfDay(selectedDate) } });
    const inventory = await Inventory.find();
    res.json(calculateProcurement(meals, inventory));
  } catch (error) { next(error); }
});
module.exports = router;
