const validateRequest = require("../middleware/validateRequest");
const { registerValidator, loginValidator } = require("../validators/userValidators");
const { registerUser, loginUser } = require("../controllers/authController");
const express = require("express");
const router = express.Router();

// Routes
router.post("/register", validateRequest(registerValidator), registerUser);
router.post("/login", validateRequest(loginValidator), loginUser);

module.exports = router;
