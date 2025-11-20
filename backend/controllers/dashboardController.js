const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDashboardStats = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    let stats = {};

    if (role === "patient") {
      // --- PATIENT VIEW (Private) ---
      // 1. Only count THEIR appointments
      const myTotal = await Appointment.countDocuments({ patient: userId });
      const myPending = await Appointment.countDocuments({ patient: userId, status: "pending" });
      const myConfirmed = await Appointment.countDocuments({ patient: userId, status: "confirmed" });

      // 2. No "Total Revenue" or "Total Doctors" for them, maybe just count how many doctors exist
      const activeDoctors = await User.countDocuments({ role: "doctor" });

      // 3. Charts for Patient (Their appointment history)
      // (Simplified: We just return their counts for now to fill the cards)
      
      res.json({
        totalPatients: 1, // Just themselves (placeholder)
        totalDoctors: activeDoctors,
        totalAppointments: myTotal,
        pendingAppointments: myPending,
        recentActivity: [], // HIDE Recent Activity Table from Patient
        pieData: [
           { name: 'Confirmed', value: myConfirmed },
           { name: 'Pending', value: myPending },
           { name: 'Cancelled', value: myTotal - (myPending + myConfirmed) }
        ],
        chartData: [] // Hide Revenue chart
      });

    } else {
      // --- ADMIN / DOCTOR VIEW (Global) ---
      const totalPatients = await User.countDocuments({ role: "patient" });
      const totalDoctors = await User.countDocuments({ role: "doctor" });
      const totalAppointments = await Appointment.countDocuments();
      const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

      const recentActivity = await Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("patient", "name")
        .populate("doctor", "name");

      const statusCounts = await Appointment.aggregate([
        { $group: { _id: "$status", value: { $sum: 1 } } }
      ]);

      const pieData = statusCounts.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.value
      }));

      // Global Chart Data
      const monthlyCounts = await Appointment.aggregate([
        { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
      ]);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const chartData = monthlyCounts.map(item => ({
        name: monthNames[item._id - 1],
        patients: item.count,
        revenue: item.count * 50
      }));

      res.json({
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        recentActivity,
        pieData,
        chartData
      });
    }

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};