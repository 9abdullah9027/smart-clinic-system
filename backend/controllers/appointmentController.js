const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Create new appointment — Only PATIENT can create
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    // Ensure doctor exists and role is doctor
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

    await appointment.save();

    // Populate doctor and patient info
await appointment.populate([
  { path: "patient", select: "name email" },
  { path: "doctor", select: "name email" }
]);


    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get appointments of logged-in patient
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all appointments — Only ADMIN
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single appointment — ADMIN or DOCTOR (if assigned)
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id)
      .populate("patient", "name email")
      .populate("doctor", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Doctors can only see their own appointments
    if (req.user.role === "doctor" && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update appointment — Only DOCTOR
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, reason, status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the assigned doctor can update
    if (req.user.role === "doctor" && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;
    if (status) appointment.status = status;

    await appointment.save();

    await appointment.populate("patient", "name email").populate("doctor", "name email");

    res.json({ message: "Appointment updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete appointment — Only ADMIN
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Appointment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
