const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  diagnosis: { type: String, required: true },
  prescription: { type: String },
  notes: { type: String },
  visitDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("MedicalHistory", historySchema);