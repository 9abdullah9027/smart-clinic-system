const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    // 1. We ignore 'role' from req.body to prevent hacking. 
    // Public registration is ALWAYS 'patient'.
    const { name, email, password, dob } = req.body;

    // Validation
    if (!name || !email || !password || !dob) {
      return res.status(400).json({ message: "Please fill in all fields (Name, Email, Password, DOB)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Force role to be patient
    const user = new User({ 
      name, 
      email, 
      password, 
      dob, 
      role: "patient" 
    });
    
    await user.save();

    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... (Keep loginUser exactly as it was) ...
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};