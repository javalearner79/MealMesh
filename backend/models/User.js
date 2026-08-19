const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'staff'], default: 'staff' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
