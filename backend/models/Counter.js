const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will store the Year (e.g., "2025")
  seq: { type: Number, default: 0 }      // This stores the count
});

// Ensure we export the model correctly
module.exports = mongoose.model("Counter", counterSchema);