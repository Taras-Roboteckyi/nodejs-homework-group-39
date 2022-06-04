const { Contact } = require("../../models/contact");

const addContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
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
