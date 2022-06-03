const express = require("express");
const createError = require("http-errors");

const router = express.Router();

const validation = require("../../middlewares/validation");
const { joiSchema, favoriteJoiSchema } = require("../../models/contact");
const validateMiddleware = validation(joiSchema);

const { Contact } = require("../../models/contact");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    console.log("lfdfq");
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
    const result = await Contact.findById(id);
    console.log(result);
    if (!result) {
      throw createError(404, `Contact with id=${id} not found`);
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
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(id);
    if (!deleteContact) {
      throw createError(404, `Not found`); // через пакет <http-errors>
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
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      throw createError(404, `Not found`); // через пакет <http-errors>
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

router.patch(
  "/:id/favorite",
  validation(favoriteJoiSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { favorite } = req.body;
      const result = await Contact.findByIdAndUpdate(
        id,
        { favorite },
        {
          new: true,
        }
      );
      if (!favorite) {
        throw createError(400, `missing field favorite `);
      }
      if (!result) {
        throw createError(404, `Not found`); // через пакет <http-errors>
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
  }
);

module.exports = router;
