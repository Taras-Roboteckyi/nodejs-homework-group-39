const express = require("express");

const router = express.Router();

const { auth, ctrlWrapper } = require("../../middlewares");

const { usersCurrent: ctrl } = require("../../controllers");

router.get("/current", auth, ctrlWrapper(ctrl.getCurrent));

router.get("/verify/:verificationToken", ctrlWrapper(ctrl.verifyEmail));

router.post("/verify", ctrlWrapper(ctrl.verify));

module.exports = router;
