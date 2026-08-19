const Inventory = require('../models/Inventory');

function validateInventory(body) {
  const { ingredientName, currentQuantity, unit, minimumStock, supplierName } = body;
  if (!ingredientName || currentQuantity === '' || currentQuantity === undefined || !unit || minimumStock === '' || minimumStock === undefined || !supplierName) return 'All inventory fields are required.';
  if (Number(currentQuantity) < 0 || Number(minimumStock) < 0) return 'Inventory quantities cannot be negative.';
  return null;
}
exports.createInventory = async (req, res, next) => {
  try { const error = validateInventory(req.body); if (error) return res.status(400).json({ message: error }); res.status(201).json(await Inventory.create(req.body)); } catch (error) { next(error); }
};
exports.getInventory = async (req, res, next) => { try { res.json(await Inventory.find().sort({ ingredientName: 1 })); } catch (error) { next(error); } };
exports.getInventoryItem = async (req, res, next) => { try { const item = await Inventory.findById(req.params.id); if (!item) return res.status(404).json({ message: 'Inventory item not found.' }); res.json(item); } catch (error) { next(error); } };
exports.updateInventory = async (req, res, next) => {
  try { const error = validateInventory(req.body); if (error) return res.status(400).json({ message: error }); const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: 'Inventory item not found.' }); res.json(item); } catch (error) { next(error); }
};
exports.deleteInventory = async (req, res, next) => { try { const item = await Inventory.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Inventory item not found.' }); res.json({ message: 'Inventory item deleted.' }); } catch (error) { next(error); } };
