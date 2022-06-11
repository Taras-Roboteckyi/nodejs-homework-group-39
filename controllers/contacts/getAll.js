const { Contact } = require("../../models/contact");

const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user; // витягуєм з middlewares auth
    const { page = 1, limit = 20 } = req.query; // витягуєм дані з пареметрів запиту
    const skip = (page - 1) * limit; // Пагінація
    const contacts = await Contact.find(
      {
        owner: _id,
      },
      "",
      { skip, limit: Number(limit) } // Обовязково має бути число, а не рядок
    ).populate("owner", "_id email subscription"); // шукаєм контакти які сам власник і додав до БД і записуєм через populate до запиту

    res.json({
      status: "success",
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    next(error.message); /* Коли база данних не відповідає */
  }
};

module.exports = getAll;
