const MealPlan = require('../models/MealPlan');

function validateMeal(body) {
  const { date, mealType, menu, expectedStudents, ingredients = [] } = body;
  if (!date || !mealType || !menu || !expectedStudents) return 'Date, meal type, menu and expected students are required.';
  if (!['Breakfast', 'Lunch', 'Dinner'].includes(mealType)) return 'Meal type must be Breakfast, Lunch, or Dinner.';
  if (Number(expectedStudents) <= 0) return 'Expected students must be greater than zero.';
  if (!Array.isArray(ingredients)) return 'Ingredients must be a list.';
  for (const item of ingredients) {
    if (!item.name || !item.unit || Number(item.quantityPerStudent) < 0) return 'Each ingredient needs a name, unit, and non-negative quantity.';
  }
  return null;
}

exports.createMeal = async (req, res, next) => {
  try {
    const error = validateMeal(req.body);
    if (error) return res.status(400).json({ message: error });
    const meal = await MealPlan.create(req.body);
    res.status(201).json(meal);
  } catch (error) { next(error); }
};

exports.getMeals = async (req, res, next) => {
  try { res.json(await MealPlan.find().sort({ date: -1, createdAt: -1 })); } catch (error) { next(error); }
};
exports.getMeal = async (req, res, next) => {
  try {
    const meal = await MealPlan.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal plan not found.' });
    res.json(meal);
  } catch (error) { next(error); }
};
exports.deleteMeal = async (req, res, next) => {
  try {
    const meal = await MealPlan.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal plan not found.' });
    res.json({ message: 'Meal plan deleted.' });
  } catch (error) { next(error); }
};
