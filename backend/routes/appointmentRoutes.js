const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  deleteAppointment,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware"); // or { protect } if exported as object

// Create appointment
router.post("/", protect, createAppointment);

// Get my appointments
router.get("/me", protect, getMyAppointments);

// Get all appointments (for admin/doctor)
router.get("/", protect, getAllAppointments);

// Delete appointment
router.delete("/:id", protect, deleteAppointment);

module.exports = router;
