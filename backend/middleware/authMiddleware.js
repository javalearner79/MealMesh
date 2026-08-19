const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required. Please log in.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('name email role');
    if (!user) return res.status(401).json({ message: 'This account no longer exists.' });
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Session expired. Please log in again.' });
    return res.status(401).json({ message: 'Invalid authentication token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have permission for this action.' });
}

module.exports = { authenticate, requireRole };
