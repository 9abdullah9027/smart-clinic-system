const express = require("express");
const cors = require("cors");
constyb = require("dotenv");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path"); // 1. Import Path
const reportRoutes = require("./routes/reportRoutes"); // 2. Import Routes

// Import Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");         // <--- NEW
const dashboardRoutes = require("./routes/dashboardRoutes"); // <--- NEW
const notificationRoutes = require("./routes/notificationRoutes"); // Import
const historyRoutes = require("./routes/historyRoutes"); // Import
const profileRoutes = require("./routes/profileRoutes"); // Import

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json());
// ... inside app.use() section ...
// 3. Make Uploads Folder Static/Public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);           // <--- NEW
app.use("/api/dashboard", dashboardRoutes);  // <--- NEW
app.use("/api/reports", reportRoutes); // 4. Register Route
app.use("/api/notifications", notificationRoutes); // Register
app.use("/api/history", historyRoutes); // Register
app.use("/api/patient-profile", profileRoutes); // Register

// Test Route
app.get("/", (req, res) => {
  res.send("Smart Clinic Backend is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));