const express = require("express");
const router = express.Router();
// Make sure we import all 4 functions
const { 
  getPatients, 
  getDoctors, 
  UserProfile, 
  updateUserProfile 
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); 

// Define Routes
router.get("/patients", protect, getPatients);
router.get("/doctors", protect, getDoctors);
router.get("/profile", protect, UserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;