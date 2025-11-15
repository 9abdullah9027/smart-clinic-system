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
const { roleCheck } = require("../middleware/roleMiddleware"); // <-- FIXED
console.log("protect =", protect);
console.log("roleCheck =", roleCheck);
console.log("roleCheck('admin') =", roleCheck("admin"));

router.post("/", protect, roleCheck("patient"), createAppointment);
router.get("/", protect, roleCheck("admin"), getAllAppointments);
router.get("/:id", protect, roleCheck("admin", "doctor"), getAppointmentById);
router.put("/:id", protect, roleCheck("doctor"), updateAppointment);
router.delete("/:id", protect, roleCheck("admin"), deleteAppointment);

module.exports = router;
