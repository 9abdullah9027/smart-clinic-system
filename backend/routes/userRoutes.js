const express = require("express");
const router = express.Router();
const { getPatients, getDoctors, UserProfile } = require("../controllers/userController");
const { protect, roleCheck } = require("../middleware/authMiddleware"); 

// Route: /api/users/patients (Only Admin/Doctor can see patients list)
router.get("/patients", protect, getPatients);

// Route: /api/users/doctors (Public or Protected, usually public for directory)
router.get("/doctors", protect, getDoctors);

// Route: /api/users/profile (Get my own profile)
router.get("/profile", protect, UserProfile);

module.exports = router;