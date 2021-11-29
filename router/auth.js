const express = require('express');

const authController = require('../controller/auth');
const club = require('../controller/createClub');
const router = express.Router();

router.get('/',authController.getSignUp);
router.get('/login',authController.getSignIn);
router.post('/authenticate',authController.postSignUp);

router.post('/login',authController.postSignIn);
// upload Docs to the local host
//router.post('/createclub',club.upload.single("docs"),club.createClub)
module.exports = router;