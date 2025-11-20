const express = require("express");
const router = express.Router();
const { addRecord, getPatientHistory } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");

// Add Record: Doctor Only
router.post("/", protect, roleCheck("doctor", "admin"), addRecord);

// Get History: Anyone (Controller handles strict checking)
router.get("/:patientId", protect, getPatientHistory);

module.exports = router;