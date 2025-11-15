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

// Get one appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
