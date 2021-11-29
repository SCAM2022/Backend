const express = require('express');

const authController = require('../controller/createClub');
const router = express.Router();

// upload Docs to the local host
router.post('/createclub',authController.upload.single("docs"),authController.createClub)
module.exports = router;