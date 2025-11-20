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
const { roleCheck } = require("../middleware/roleMiddleware"); // Import Role Check

// 1. Create: Patients & Admins can book
router.post("/", protect, roleCheck("patient", "admin"), createAppointment);

// 2. Get My: Everyone needs this
router.get("/my", protect, getMyAppointments);

// 3. Get Single: Everyone (Controller handles ownership check)
router.get("/:id", protect, getAppointmentById);

// 4. Update: Only Doctors (to confirm) or Admin
router.put("/:id", protect, roleCheck("doctor", "admin"), updateAppointment);

// 5. Delete: Only Admin (Or we could allow patient to cancel, but let's say Delete is Admin only)
router.delete("/:id", protect, roleCheck("admin", "patient"), deleteAppointment); 
// Note: I added 'patient' here too so they can delete their own via the UI button we made. 
// For strict security, you'd usually use a separate "cancel" endpoint.

// 6. Get All: Admin Only
router.get("/", protect, roleCheck("admin"), getAllAppointments);

module.exports = router;