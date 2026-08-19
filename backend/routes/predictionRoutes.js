const router = require('express').Router();
const { getDemandPrediction } = require('../services/demandPredictionService');

const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

router.get('/demand', async (req, res, next) => {
  try {
    const date = req.query.date || new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const mealType = req.query.mealType || 'Lunch';
    const targetDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(targetDate.getTime()) || !mealTypes.includes(mealType)) return res.status(400).json({ message: 'Use a valid date and meal type (Breakfast, Lunch, or Dinner).' });

    const prediction = await getDemandPrediction(date, mealType);
    res.json(prediction);
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(500).json({ message: 'Python is not available. Set PYTHON_PATH or install Python.' });
    next(error);
  }
});

module.exports = router;
