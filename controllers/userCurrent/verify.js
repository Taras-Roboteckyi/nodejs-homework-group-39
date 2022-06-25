const createError = require("http-errors");

const { User } = require("../../models/user");
const { sendEmail } = require("../../helpers");

const verify = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }); // поверне null якщо не знайде

  if (!user) {
    throw createError(400, `User with email ${email} not found`);
  }

  if (user.verify) {
    throw createError(400, `"Verification has already been passed"`);
  }

  const mail = {
    // створюєм поштовий лист з силкою для  підтвердження
    to: email,
    subject: "Подтверждения email",
    html: `<a target="_blank" href="https://localhost:4600/api/users/verify/${user.verificationToken}">Подтвердить email</a>`,
  };
  await sendEmail(mail); // відправляєм лист

  res.json({
    message: "Verification email sent",
  });
};

module.exports = verify;
