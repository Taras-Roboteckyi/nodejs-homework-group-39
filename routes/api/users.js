const express = require("express");

const router = express.Router();

const { auth, ctrlWrapper, validation, upload } = require("../../middlewares");

const { joiSchema, subscriptionJoiSchema } = require("../../models/user");

const { users: ctrl } = require("../../controllers");

router.post("/signup", validation(joiSchema), ctrlWrapper(ctrl.signUp));

router.post("/login", validation(joiSchema), ctrlWrapper(ctrl.logIn));

router.get("/logout", auth, ctrlWrapper(ctrl.logOut));

router.patch(
  "/subscription",
  auth,
  validation(subscriptionJoiSchema),
  ctrlWrapper(ctrl.updateSubscription)
);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrlWrapper(ctrl.updateAvatar)
);

module.exports = router;
