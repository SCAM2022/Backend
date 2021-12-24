const express = require("express");

const authController = require("../controller/createClub");
const router = express.Router();
const Auth = require("../token/token");
// upload Docs to the local host
router.post("/checkClub", authController.checkClub);
router.post(
  "/createclub",
  Auth,
  authController.upload.single("docs"),
  authController.createClub
);
router.post("/joinclub", Auth, authController.joinClub);
router.get("/findClub", authController.findClub);
router.post("/memberList", authController.getMemberList);
module.exports = router;
