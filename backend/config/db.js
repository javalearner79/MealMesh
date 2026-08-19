const mongoose = require('mongoose');

async function connectDatabase() {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
}

module.exports = connectDatabase;
