const { Contact } = require("../../models/contact");

const getAll = async (req, res, next) => {
  try {
    const { _id } = req.user; // витягуєм з middlewares auth
    const contacts = await Contact.find({ owner: _id }); // шукаєм контакти які сам власник і додав до БД

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
