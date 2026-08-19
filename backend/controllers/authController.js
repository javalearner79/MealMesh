const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function publicUser(user) { return { id: user._id, name: user.name, email: user.email, role: user.role }; }
function createToken(user) { return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }); }

exports.register = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (name.length < 2) return res.status(400).json({ message: 'Name must contain at least 2 characters.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
    if (await User.exists({ email })) return res.status(409).json({ message: 'Email already registered.' });
    const isFirstUser = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: isFirstUser ? 'admin' : 'staff' });
    res.status(201).json({ user: publicUser(user), token: createToken(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    res.json({ user: publicUser(user), token: createToken(user) });
  } catch (error) { next(error); }
};

exports.me = (req, res) => res.json({ user: publicUser(req.user) });
exports.logout = (req, res) => res.json({ message: 'Logged out. Remove the token from the client.' });
