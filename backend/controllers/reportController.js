const Report = require("../models/Report");
const User = require("../models/User");

// 1. Upload Report (Doctor Only)
exports.uploadReport = async (req, res) => {
  try {
    // Multer puts the file in req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { patientId, title } = req.body;

    // Verify patient exists
    const patientUser = await User.findById(patientId);
    if (!patientUser || patientUser.role !== "patient") {
      return res.status(400).json({ message: "Invalid patient selected" });
    }

    // Create Record
    const report = new Report({
      doctor: req.user._id,
      patient: patientId,
      title: title,
      fileUrl: `/uploads/${req.file.filename}` // Save path
    });

    await report.save();

    res.status(201).json({ message: "Report uploaded successfully", report });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Get Reports (Role Based)
exports.getReports = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "patient") {
      // Patient sees ONLY their reports
      query = { patient: req.user._id };
    } else if (req.user.role === "doctor") {
      // Doctor sees reports THEY uploaded
      query = { doctor: req.user._id };
    } else {
      // Admin sees all
      query = {};
    }

    const reports = await Report.find(query)
      .populate("doctor", "name")
      .populate("patient", "name")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. Delete Report (Doctor/Admin)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Security check: Only owner doctor or admin can delete
    if (req.user.role !== "admin" && report.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this report" });
    }

    // Note: Ideally we should delete the file from disk here too using fs.unlink
    await Report.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Report deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};