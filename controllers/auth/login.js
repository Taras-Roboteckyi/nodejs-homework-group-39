const { User } = require("../../models/user");
const createError = require("http-errors");

const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // поверне null якщо не знайде

  if (!user || !user.verify || !user.comparePassword(password)) {
    // user.comparePassword - метод з схеми userSchema
    throw createError(401, `Email or password is wrong or not verify`);
  }

  const payload = {
    // створюєм id для токена
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // створюєм ТОКЕН, який свіжий буде 1 годину
  await User.findByIdAndUpdate(user._id, { token }); // записуєм новий токен в БД

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: { email, subscription: user.subscription },
    },
  });
};

module.exports = logIn;
