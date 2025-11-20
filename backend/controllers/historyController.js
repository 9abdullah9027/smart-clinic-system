const MedicalHistory = require("../models/MedicalHistory");
const PatientProfile = require("../models/PatientProfile"); // <--- 1. Import Profile Model

// 1. Add Record (Doctor Only)
exports.addRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes } = req.body;

    // A. Create the Medical History Record
    const record = new MedicalHistory({
      patient: patientId,
      doctor: req.user._id,
      diagnosis,
      prescription,
      notes
    });

    await record.save();
    await record.populate("doctor", "name specialization");

    // B. AUTOMATICALLY UPDATE VISIT COUNT & LAST VISIT DATE
    await PatientProfile.findOneAndUpdate(
      { patient: patientId },
      { 
        $inc: { previousVisitsCount: 1 }, // Increment count by 1
        $set: { lastVisitDate: new Date() } // Set last visit to NOW
      },
      { new: true, upsert: true } // Create profile if missing
    );

    res.status(201).json({ message: "Record added", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Get History for a Patient
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const history = await MedicalHistory.find({ patient: patientId })
      .populate("doctor", "name specialization")
      .sort({ visitDate: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};