const { Contact } = require("../../models/contact");

const addContact = async (req, res, next) => {
  try {
    const { _id } = req.user; // витягуєм з middlewares auth
    const newContact = await Contact.create({ ...req.body, owner: _id }); // додаєм юзера який залогінений
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        result: newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addContact;
