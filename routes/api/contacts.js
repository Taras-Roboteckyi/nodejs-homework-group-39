const express = require("express");
const createError = require("http-errors");

const router = express.Router();

const validation = require("../../middlewares/validation");
const contactSchema = require("../../shemas/contactSchema");
const validateMiddleware = validation(contactSchema);

const contactsOperations = require("../../models");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();
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
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsOperations.getContactById(id);
    if (!result) {
      throw createError(
        404,
        `Contact with id=${id} not found`
      ); /* через пакет <http-errors> */

      /* Або 2 варіант генерити вручну помилку */
      /*  const error = new Error(`Contact with id=${id} not found`);
      error.status = 404;
      throw error; */
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateMiddleware, async (req, res, next) => {
  try {
    const newContact = await contactsOperations.addContact(req.body);
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
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await contactsOperations.removeContact(id);
    if (!deleteContact) {
      throw createError(404, `Not found`); /* через пакет <http-errors> */
    }
    res.json({
      status: "success",
      code: 200,
      message: "contact deleted",
      data: {
        result: deleteContact,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", validateMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsOperations.updateContact(id, req.body);
    if (!result) {
      throw createError(404, `Not found`); /* через пакет <http-errors> */
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
