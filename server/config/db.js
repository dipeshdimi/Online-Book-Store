const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = connectDB;
