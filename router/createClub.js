const express = require('express');

const authController = require('../controller/createClub');
const router = express.Router();
const Auth = require('../token/token')
// upload Docs to the local host
router.post('/createclub',Auth,authController.upload.single("docs"),authController.createClub)
module.exports = router;