const PatientProfile = require("../models/PatientProfile");
const User = require("../models/User");

// Get Profile (Create if not exists)
exports.getProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    let profile = await PatientProfile.findOne({ patient: patientId })
      .populate("patient", "name mrn email dob gender fatherName nationalId phone address emergencyContact") // Fetch user personal data too
      .populate("assignedDoctor", "name specialization");

    if (!profile) {
        // Create empty profile if it's the first time accessing
        profile = await PatientProfile.create({ patient: patientId });
        // Re-fetch to populate
        profile = await PatientProfile.findById(profile._id)
          .populate("patient", "name mrn email dob gender phone");
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile (Doctor Only)
exports.updateProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    // Add audit trail
    updateData.lastUpdatedBy = req.user._id;

    const profile = await PatientProfile.findOneAndUpdate(
      { patient: patientId },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ message: "Medical Profile Updated", profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};