const User = require("../models/User");

// 1. Get list of all Patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Get list of all Doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password").sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. Get User Profile (Generic)
exports.UserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if(user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 4. UPDATE User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Update Specialization (Only affects Doctors)
      if (req.body.specialization) {
        user.specialization = req.body.specialization;
      }

      if (req.body.password) {
        user.password = req.body.password; 
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        specialization: updatedUser.specialization,
        message: "Profile updated successfully"
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 5. Create Staff (Admin Only)
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role (Must be doctor or admin)
    if (role !== 'doctor' && role !== 'admin') {
      return res.status(400).json({ message: "Invalid role for staff" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with the specific role
    const user = new User({ 
      name, 
      email, 
      password, 
      role,
      dob: new Date() // Default DOB for staff
    });
    
    await user.save();

    res.status(201).json({ message: `${role} created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 6. Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};