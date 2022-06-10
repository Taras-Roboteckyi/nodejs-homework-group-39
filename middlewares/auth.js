/* ОСНОВНІ ЗАДАЧІ ПРИ АВТОРИЗАЦІЇ - ЦЕ УНІВЕРСАЛЬНА ПРОСЛОЙКА

Извлекает токен из заголовка и:
1. Проверяет валидность токена (то есть что мы его выдали и он не истек).
2. Извлекает из токена id, находит пользователя в базе по id и прикрепляет его 
к запросу (req.user).
*/

const { User } = require("../models/user");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers; // Извлечь из заголовков запроса содержимое заголовка Authorization.

  const [bearer, token] = authorization.split(" "); // Разделить его на 2 слова: bearer и токен.

  try {
    if (bearer !== "Bearer") {
      // Проверить равно ли первое слово "Bearer".
      throw createError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, SECRET_KEY); // Проверить валидность второго слова (токен). Если токен валиден - извлечь из него id и найти пользователя в базе с таким id
    const user = await User.findById(id);

    if (!user) {
      throw createError(401, "Not authorized");
    }

    req.user = user; // Если пользователя с таким id мы нашли в базе - его нужно прикрепить к запросу (объект req).
    next();
  } catch (error) {
    if (error.message === "Invalid sugnature") {
      // якщо токен не валідний викидаєм помилку
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
