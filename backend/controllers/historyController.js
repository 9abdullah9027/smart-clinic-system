const MedicalHistory = require("../models/MedicalHistory");

// 1. Add Record (Doctor Only)
exports.addRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes } = req.body;

    const record = new MedicalHistory({
      patient: patientId,
      doctor: req.user._id,
      diagnosis,
      prescription,
      notes
    });

    await record.save();
    await record.populate("doctor", "name"); // Return doctor name immediately

    res.status(201).json({ message: "Record added", record });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Get History for a Patient (Doctors + Patient themselves)
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Security: Patients can only view their own
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