const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  quantityPerStudent: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true, lowercase: true }
}, { _id: false });

const mealPlanSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  mealType: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner'] },
  menu: { type: String, required: true, trim: true },
  expectedStudents: { type: Number, required: true, min: 1 },
  ingredients: { type: [ingredientSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
