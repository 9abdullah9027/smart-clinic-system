const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  // Primary Care
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Medical Data
  bloodGroup: { type: String },
  allergies: { type: String }, // "Peanuts, Penicillin"
  chronicConditions: { type: String }, // "Diabetes, Hypertension"
  currentMedications: { type: String },
  surgicalHistory: { type: String },
  vaccinationStatus: { type: String }, // "Fully Vaccinated", "Partial"
  primaryDiagnosis: { type: String },

  // Audit
  lastVisitDate: { type: Date },
  previousVisitsCount: { type: Number, default: 0 },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

module.exports = mongoose.model("PatientProfile", patientProfileSchema);