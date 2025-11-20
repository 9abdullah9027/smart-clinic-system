const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");

// Get: Doctor, Admin, or Patient (Self)
router.get("/:patientId", protect, getProfile);

// Update: Doctor or Admin ONLY
router.put("/:patientId", protect, roleCheck("doctor", "admin"), updateProfile);

module.exports = router;