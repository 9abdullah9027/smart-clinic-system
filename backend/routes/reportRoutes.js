const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");
const { uploadReport, getReports, deleteReport } = require("../controllers/reportController");

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Create unique filename: report-TIMESTAMP.pdf
    cb(null, `report-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter: Only PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// --- ROUTES ---

// Upload: Protected, Doctor Only, Single File 'file'
router.post("/", protect, roleCheck("doctor", "admin"), upload.single("file"), uploadReport);

// Get: Protected (Logic handles who sees what)
router.get("/", protect, getReports);

// Delete: Protected, Doctor/Admin
router.delete("/:id", protect, roleCheck("doctor", "admin"), deleteReport);

module.exports = router;