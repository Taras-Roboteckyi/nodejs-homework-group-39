const { User } = require("../../models/user");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // поверне null якщо не знайде
  if (user) {
    throw createError(409, `Email ${email} in use`);
  }
  const salt = bcrypt.genSaltSync(10); // солим наш пароль
  const hashPassword = bcrypt.hashSync(password, salt); // хешуєм наш пароль

  const result = await User.create({ email, password: hashPassword });
  const { subscription } = result;

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: { email, subscription },
    },
  });
};

module.exports = signUp;
