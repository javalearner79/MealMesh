const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  meal: { type: String, required: true, trim: true },
  ingredientName: { type: String, required: true, trim: true },
  preparedQuantity: { type: Number, required: true, min: 0 },
  consumedQuantity: { type: Number, required: true, min: 0 },
  wasteQuantity: { type: Number, required: true, min: 0 },
  wastePercentage: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WasteLog', wasteLogSchema);
