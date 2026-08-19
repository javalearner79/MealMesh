const { spawn } = require('child_process');
const path = require('path');
const MealPlan = require('../models/MealPlan');
const { startOfDay } = require('../utils/calculations');

const cache = new Map();
const inFlight = new Map();
const cacheDurationMs = 5 * 60 * 1000;

function runPrediction(payload) {
  return new Promise((resolve, reject) => {
    const python = process.env.PYTHON_PATH || 'python';
    const scriptPath = path.join(__dirname, '../../ml/predict_demand.py');
    const childProcess = spawn(python, [scriptPath], { windowsHide: true });
    let output = '';
    let errorOutput = '';
    const timeout = setTimeout(() => childProcess.kill(), 15000);
    childProcess.stdout.on('data', (chunk) => output += chunk);
    childProcess.stderr.on('data', (chunk) => errorOutput += chunk);
    childProcess.on('error', (error) => { clearTimeout(timeout); reject(error); });
    childProcess.on('close', (code) => {
      clearTimeout(timeout);
      try {
        const result = JSON.parse(output);
        if (code !== 0 && !result.message) return reject(new Error(errorOutput || 'Prediction script failed.'));
        resolve(result);
      } catch (error) { reject(new Error(errorOutput || 'Prediction script returned invalid JSON.')); }
    });
    childProcess.stdin.end(JSON.stringify(payload));
  });
}

async function getDemandPrediction(date, mealType) {
  const cacheKey = `${date}:${mealType}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < cacheDurationMs) return { ...cached.result, cached: true };
  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);
  const task = (async () => {
    const targetDate = new Date(`${date}T00:00:00`);
    const history = await MealPlan.find({ date: { $lt: startOfDay(targetDate) } }).select('date mealType expectedStudents -_id').sort({ date: 1 });
    const result = await runPrediction({ target: { date, mealType }, history });
    cache.set(cacheKey, { createdAt: Date.now(), result });
    return { ...result, cached: false };
  })();
  inFlight.set(cacheKey, task);
  try { return await task; } finally { inFlight.delete(cacheKey); }
}

module.exports = { getDemandPrediction };
