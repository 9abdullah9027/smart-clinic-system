const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

    // 2. Recent Activity (Last 5)
    const recentActivity = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("patient", "name")
      .populate("doctor", "name");

    // 3. PIE CHART DATA: Group by Status
    const statusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      }
    ]);

    // Format for Recharts [{ name: 'Pending', value: 10 }, ...]
    const pieData = statusCounts.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1), // Capitalize
      value: item.value
    }));

    // 4. AREA CHART DATA: Group by Month (Last 6 Months)
    const monthlyCounts = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$date" }, // Group by Month Number (1-12)
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } } // Sort Jan -> Dec
    ]);

    // Map month numbers to names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Create default structure for all months to avoid gaps
    const chartData = monthlyCounts.map(item => ({
      name: monthNames[item._id - 1], // Convert 1 to "Jan"
      patients: item.count,
      revenue: item.count * 50 // Assuming $50 per appointment for revenue demo
    }));

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      recentActivity,
      pieData,   // <--- NEW
      chartData  // <--- NEW
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
  }
};