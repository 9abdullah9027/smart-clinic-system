const User = require("../models/User");

// Get list of all Patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get list of all Doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password").sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get User Profile (Generic)
exports.UserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}