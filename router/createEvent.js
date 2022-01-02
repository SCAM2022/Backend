const express = require('express');
const Event = require('../controller/createEvent')
const router = express.Router();
const Auth = require('../token/token')

router.post('/createEvent',Auth,Event.postCreateEvent);
router.post('/fetchEvents',Auth,Event.postFetchEvents);
router.post('/fetchSingleEvent',Event.fetchSingleEvent);
module.exports = router;