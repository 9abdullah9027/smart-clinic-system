const express = require("express");
const router = express.Router();
const { 
  getPatients, 
  getDoctors, 
  UserProfile, 
  updateUserProfile,
  createStaff 
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); 
const { roleCheck } = require("../middleware/roleMiddleware"); 

// Define Routes
router.get("/patients", protect, roleCheck("doctor", "admin"), getPatients);
router.get("/doctors", protect, getDoctors);
router.get("/profile", protect, UserProfile);
router.put("/profile", protect, updateUserProfile);

// New Route: Create Staff (Admin Only)
router.post("/staff", protect, roleCheck("admin"), createStaff);

module.exports = router;