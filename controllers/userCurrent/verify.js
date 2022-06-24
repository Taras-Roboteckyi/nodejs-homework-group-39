const createError = require("http-errors");

const { v4: uuidv4 } = require("uuid");

const { User } = require("../../models/user");
const { sendEmail } = require("../../helpers");

const verify = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // поверне null якщо не знайде
  if (user) {
    throw createError(409, `Email ${email} in use`);
  }

  const avatarURL = gravatar.url(email, { protocol: "http", size: "100" }); // генеруєм аватар по email

  const salt = bcrypt.genSaltSync(10); // солим наш пароль
  const hashPassword = bcrypt.hashSync(password, salt); // хешуєм наш пароль

  const verificationToken = uuidv4(); // генеруєм id для верифікації токена

  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const { subscription } = result;

  const mail = {
    // створюєм поштовий лист з силкою для  підтвердження
    to: email,
    subject: "Подтверждения email",
    html: `<a target="_blank" href="https://localhost:4600/api/users/verify/${verificationToken}">Подтвердить email</a>`,
  };
  await sendEmail(mail); // відправляєм лист

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: { email, subscription, avatarURL, verificationToken },
    },
  });
};

module.exports = verify;
