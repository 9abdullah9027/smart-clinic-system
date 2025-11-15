const Joi = require("joi");

const createAppointmentValidator = Joi.object({
  doctor: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  reason: Joi.string().min(5).max(200).required()
});

module.exports = { createAppointmentValidator };
