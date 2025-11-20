const Appointment = require("../models/Appointment");
const User = require("../models/User");

// --- 1. Create Appointment ---
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    // Validate Doctor
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor,
      date,
      time,
      reason,
    });

    // Save to DB
    await appointment.save();

    // --- FIX 1: POPULATE DATA BEFORE SENDING RESPONSE ---
    // This ensures the frontend gets { patient: { name: "John" } } instead of just ID
    await appointment.populate("patient", "name email");
    await appointment.populate("doctor", "name email");

    res.status(201).json({ message: "Appointment created", appointment });

  } catch (error) {
    // --- FIX 2: HANDLE DUPLICATE ERROR SPECIFICALLY ---
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Appointment slot is not available. Please choose another time." 
      });
    }

    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 2. Get MY Appointments (Smart Filter) ---
exports.getMyAppointments = async (req, res) => {
  try {
    let query = {};

    // Admin: Show ALL
    if (req.user.role === 'admin') {
      query = {}; 
    } 
    // Doctor: Show assigned
    else if (req.user.role === 'doctor') {
      query = { doctor: req.user._id };
    } 
    // Patient: Show booked
    else {
      query = { patient: req.user._id };
    }

    const appointments = await Appointment.find(query)
      .populate("doctor", "name email")
      .populate("patient", "name email")
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 3. Get All Appointments (Admin) ---
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 4. Get Single Appointment ---
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 5. Update Appointment ---
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, reason, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: "Not found" });

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (status) appointment.status = status;

    await appointment.save();
    
    // Ensure we return populated data on update too (optional but good practice)
    await appointment.populate("patient", "name email");
    await appointment.populate("doctor", "name email");

    res.json({ message: "Appointment updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- 6. Delete Appointment ---
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};