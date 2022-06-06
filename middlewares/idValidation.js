const mongoose = require("mongoose");

const createError = require("http-errors");

const idValidation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isError = !mongoose.isObjectIdOrHexString(id);

    if (isError) {
      throw createError(400, `Contact with id=${id} is not valid`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = idValidation;
