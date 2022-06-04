const express = require("express");

const router = express.Router();

const validation = require("../../middlewares/validation");
const idValidation = require("../../middlewares/idValidation");
const { joiSchema, favoriteJoiSchema } = require("../../models/contact");
const validateMiddleware = validation(joiSchema);

const {
  getAll,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

router.get("/", getAll);

router.get("/:id", idValidation, getById);

router.post("/", validateMiddleware, addContact);

router.delete("/:id", idValidation, removeContact);

router.put("/:id", validateMiddleware, updateContact);

router.patch(
  "/:id/favorite",
  validation(favoriteJoiSchema),
  updateStatusContact
);

module.exports = router;
