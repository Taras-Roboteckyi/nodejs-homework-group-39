/* const { User } = require("../../models/user");
const createError = require("http-errors");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env; */

const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      email,
      subscription,
    },
  });
};

module.exports = getCurrent;
