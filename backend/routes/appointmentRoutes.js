const express = require("express");
const router = express.Router();
const { 
  createAppointment, 
  getMyAppointments, 
  getAllAppointments, 
  getAppointmentById, 
  updateAppointment, 
  deleteAppointment 
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

// --- ROUTES ---

// 1. Create Appointment (Patients only)
router.post("/", protect, createAppointment);

// 2. Get MY Appointments (Patients see theirs, Doctors see their schedule)
router.get("/my", protect, getMyAppointments);

// 3. Get Single Appointment by ID
router.get("/:id", protect, getAppointmentById);

// 4. Update Appointment (Doctors update status/notes)
router.put("/:id", protect, updateAppointment);

// 5. Delete Appointment (Admin/Patient cancellation)
router.delete("/:id", protect, deleteAppointment);

// 6. Get All Appointments (Admin only - optional)
// Note: If you haven't implemented 'roleCheck' middleware properly yet, 
// you can leave this protected or remove the roleCheck part for now.
router.get("/", protect, getAllAppointments);

module.exports = router;