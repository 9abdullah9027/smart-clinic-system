const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Completed", "Cancelled"], default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
