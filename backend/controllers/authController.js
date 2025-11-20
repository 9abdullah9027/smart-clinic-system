const User = require("../models/User");
const Counter = require("../models/Counter"); // <--- Import Counter
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, dob, role, gender, phone, fatherName, nationalId, address, emergencyContact } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // --- MRN GENERATION LOGIC ---
    let mrn = null;
    if (!role || role === 'patient') {
      const currentYear = new Date().getFullYear().toString();
      
      // Find counter for this year and increment, or create if doesn't exist
      const counter = await Counter.findByIdAndUpdate(
        { _id: currentYear },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format: SC-2025-0001
      const seqId = counter.seq.toString().padStart(4, '0'); // '1' -> '0001'
      mrn = `SC-${currentYear}-${seqId}`;
    }
    // ----------------------------

    const user = new User({ 
      name, email, password, dob, role: role || "patient",
      gender, phone, fatherName, nationalId, address, emergencyContact,
      mrn // Save generated MRN
    });
    
    await user.save();

    res.status(201).json({ message: "Patient registered successfully", mrn });
  } catch (error) {
    console.error("Reg Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... (keep loginUser as is) ...
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