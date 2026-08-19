const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  ingredientName: { type: String, required: true, trim: true },
  currentQuantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true, lowercase: true },
  minimumStock: { type: Number, required: true, min: 0 },
  supplierName: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
