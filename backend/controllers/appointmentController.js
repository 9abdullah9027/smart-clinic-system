const Appointment = require("../models/Appointment");

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;

    const appointment = new Appointment({
      patient: req.user._id,
      doctor,
      date,
      time,
      reason,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get appointments of logged-in user
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Admin or doctor can get all appointments (optional)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient", "name email");
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

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