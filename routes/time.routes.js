const express = require('express');
const router = express.Router();

const timeController = require('../controllers/time.controller');

/*
* Defining endpoints for Time related controllers
*/
router.put('/times/arrivals', timeController.updateArrivalTime);

module.exports = router;