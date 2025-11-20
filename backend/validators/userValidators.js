const Joi = require("joi");

const registerValidator = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  dob: Joi.date().required(), // <--- Added this line to allow DOB
  role: Joi.string().valid("admin", "doctor", "patient").optional()
});

const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerValidator, loginValidator };