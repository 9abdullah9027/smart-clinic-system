const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Count Patients
    const totalPatients = await User.countDocuments({ role: "patient" });

    // 2. Count Doctors
    const totalDoctors = await User.countDocuments({ role: "doctor" });

    // 3. Count Appointments
    const totalAppointments = await Appointment.countDocuments();
    
    // 4. Calculate "Pending" Appointments
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

    // 5. Recent Appointments (Limit 5)
    const recentActivity = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patient", "name")
      .populate("doctor", "name");

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      recentActivity
    });

  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
  }
};