const express = require("express");

const router = express.Router();

const { auth, validation, idValidation } = require("../../middlewares");

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

router.get("/", auth, getAll);

router.get("/:id", idValidation, getById);

router.post("/", auth, validateMiddleware, addContact);

router.delete("/:id", idValidation, removeContact);

router.put("/:id", validateMiddleware, updateContact);

router.patch(
  "/:id/favorite",
  validation(favoriteJoiSchema),
  updateStatusContact
);

module.exports = router;
