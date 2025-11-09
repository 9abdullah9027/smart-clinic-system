const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment"); // We'll create this model next

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: "Appointment created", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all appointments (for testing)
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
