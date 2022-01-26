const express = require("express");

const authController = require("../controller/createClub");
const router = express.Router();
const Auth = require("../token/token");
const clubAchievements = require("../controller/clubAchievement");
// upload Docs to the local host
router.post("/checkClub", authController.checkClub);
router.post(
  "/createclub",
  Auth,
  authController.upload.array("docs"),
  authController.createClub
);
router.post("/joinclub", Auth, authController.joinClub);
router.get("/findClub", authController.findClub);
router.post("/club", authController.postSingleClub);
router.post("/memberList", authController.getMemberList);
router.post("/deleteClub", Auth, authController.postDeleteClub);
router.post("/leftClub", Auth, authController.leftClub);

router.post("/chat", authController.chat);
// router.post("/sendchat", Auth, authController.chats);
// router.post("/editChat", Auth, authController.editMsg);
router.post("/deleteChat", Auth, authController.deleteMsg);
router.post(
  "/uploadClubAcievements",
  Auth,
  clubAchievements.uploadImg.single("img"),
  clubAchievements.uploadImages
);
router.post("/fetchAchievements", clubAchievements.fetchClubAchievements);
module.exports = router;
