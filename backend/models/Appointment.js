const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true
  },
  doctor: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
