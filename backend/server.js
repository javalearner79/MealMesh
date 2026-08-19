require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/db');
const { authenticate } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/meals', authenticate, require('./routes/mealRoutes'));
app.use('/api/inventory', authenticate, require('./routes/inventoryRoutes'));
app.use('/api/waste', authenticate, require('./routes/wasteRoutes'));
app.use('/api/procurement', authenticate, require('./routes/procurementRoutes'));
app.use('/api/dashboard', authenticate, require('./routes/dashboardRoutes'));
app.use('/api/predictions', authenticate, require('./routes/predictionRoutes'));
app.use('/api/analytics', authenticate, require('./routes/analyticsRoutes'));
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.use((error, req, res, next) => {
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid record ID.' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors)[0].message });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

const port = process.env.PORT || 5000;
if (!process.env.JWT_SECRET) { console.error('JWT_SECRET is required. Add it to .env before starting MealMesh.'); process.exit(1); }
connectDatabase().then(() => app.listen(port, () => console.log(`MealMesh running at http://localhost:${port}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
