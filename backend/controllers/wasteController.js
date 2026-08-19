const WasteLog = require('../models/WasteLog');

exports.createWaste = async (req, res, next) => {
  try {
    const { date, meal, ingredientName, preparedQuantity, consumedQuantity, wasteQuantity } = req.body;
    if (!date || !meal || !ingredientName || preparedQuantity === undefined || consumedQuantity === undefined || wasteQuantity === undefined) return res.status(400).json({ message: 'Date, meal, ingredient, and quantities are required.' });
    const prepared = Number(preparedQuantity), consumed = Number(consumedQuantity), waste = Number(wasteQuantity);
    if (prepared <= 0 || consumed < 0 || waste < 0) return res.status(400).json({ message: 'Prepared quantity must be positive; consumed and waste cannot be negative.' });
    if (consumed > prepared) return res.status(400).json({ message: 'Consumed quantity cannot exceed prepared quantity.' });
    if (consumed + waste > prepared) return res.status(400).json({ message: 'Consumed plus waste cannot exceed prepared quantity.' });
    const log = await WasteLog.create({ date, meal, ingredientName, preparedQuantity: prepared, consumedQuantity: consumed, wasteQuantity: waste, wastePercentage: Number(((waste / prepared) * 100).toFixed(2)) });
    res.status(201).json(log);
  } catch (error) { next(error); }
};
exports.getWaste = async (req, res, next) => { try { res.json(await WasteLog.find().sort({ date: -1, createdAt: -1 })); } catch (error) { next(error); } };
exports.getWasteLog = async (req, res, next) => { try { const log = await WasteLog.findById(req.params.id); if (!log) return res.status(404).json({ message: 'Waste record not found.' }); res.json(log); } catch (error) { next(error); } };
exports.deleteWaste = async (req, res, next) => { try { const log = await WasteLog.findByIdAndDelete(req.params.id); if (!log) return res.status(404).json({ message: 'Waste record not found.' }); res.json({ message: 'Waste record deleted.' }); } catch (error) { next(error); } };
