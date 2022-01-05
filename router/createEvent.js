const express = require('express');
const Event = require('../controller/createEvent')
const router = express.Router();
const Auth = require('../token/token')
router.post('/createEvent',Auth,Event.postCreateEvent);
router.get('/fetchEvents',Event.postFetchEvents);
router.post('/fetchSingleEvent',Event.fetchSingleEvent);
router.post('/setReminder',Auth,Event.setReminder)
router.post('/addParticipant',Auth,Event.participationList)
router.post('/fetchParticipationList',Auth,Event.fetchParticipationList);
router.post('/addEventsToProfile',Auth,Event.addEventsToProfile);
module.exports = router;