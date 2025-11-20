const Joi = require("joi");

const registerValidator = Joi.object({
  // Core Login Info
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().required(),
  role: Joi.string().valid("admin", "doctor", "patient").optional(),

  // --- NEW ALLOWED FIELDS ---
  fatherName: Joi.string().optional().allow(''),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  nationalId: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  address: Joi.string().optional().allow(''),
  
  // Object validation for Emergency Contact
  emergencyContact: Joi.object({
    name: Joi.string().optional().allow(''),
    phone: Joi.string().optional().allow('')
  }).optional()
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerValidator, loginValidator };