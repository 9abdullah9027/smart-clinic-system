const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");

// PATIENT creates appointment
router.post("/", protect, roleCheck("patient"), createAppointment);

// PATIENT views own appointments
router.get("/me", protect, roleCheck("patient"), getMyAppointments);

// ADMIN views all appointments
router.get("/", protect, roleCheck("admin"), getAllAppointments);

// ADMIN or DOCTOR views a single appointment
router.get("/:id", protect, roleCheck("admin", "doctor"), getAppointmentById);

// DOCTOR updates appointment
router.put("/:id", protect, roleCheck("doctor"), updateAppointment);

// ADMIN deletes appointment
router.delete("/:id", protect, roleCheck("admin"), deleteAppointment);

module.exports = router;
