const express = require("express");
const cors = require("cors");
constyb = require("dotenv");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");         // <--- NEW
const dashboardRoutes = require("./routes/dashboardRoutes"); // <--- NEW

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);           // <--- NEW
app.use("/api/dashboard", dashboardRoutes);  // <--- NEW

// Test Route
app.get("/", (req, res) => {
  res.send("Smart Clinic Backend is running 🚀");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));