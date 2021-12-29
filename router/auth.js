const express = require("express");

const { body } = require("express-validator");
const authController = require("../controller/auth");
const club = require("../controller/createClub");
const router = express.Router();
const Auth = require("../token/token");
router.get("/", authController.getSignUp);
router.get("/login", Auth, authController.getSignIn);
router.post(
  "/checkEmail",
  [body("email").isEmail().withMessage("Invalid !").normalizeEmail()],
  authController.postCheckEmail
);
router.post("/checkRoll", authController.postCheckRoll);
router.post("/authenticate", authController.postSignUp);
router.post("/login", authController.postSignIn);
router.post("/user", Auth, authController.getUser);
router.put("/updateUser", Auth, authController.updateProfile);
module.exports = router;
