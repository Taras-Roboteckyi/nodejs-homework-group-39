const { Schema, model } = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

/* створюєм схему */
const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

/* створюєм додатково JOI схему */
const joiSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    "any.required": "missing required password field",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk"] },
    })
    .required()
    .messages({
      "any.required": "missing required email field",
    }),
  /*  subscription: Joi.string().required().messages({
    "any.required": "missing required subscription field",
  }),
  token: Joi.string().required().messages({
    "any.required": "missing required token field",
  }),
  owner: Joi.string().required().messages({
    "any.required": "missing required owner field",
  }), */
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // перевіряєм чи є захешований пароль в БД, поверне false або true
};

const User = model("users", userSchema); /* створюєм модель */

module.exports = { User, joiSchema };
