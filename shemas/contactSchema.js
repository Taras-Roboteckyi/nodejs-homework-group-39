const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(8).required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "any.required": "missing required email field",
    }),
  phone: Joi.string().min(7).max(15).required().messages({
    "any.required": "missing required phone field",
  }),
});

module.exports = contactSchema;
