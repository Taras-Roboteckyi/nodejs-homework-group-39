const { User } = require("../../models/user");
const createError = require("http-errors");

const logOut = async (req, res, next) => {
  const { _id } = req.user;
  const deleteToken = await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

module.exports = logOut;
