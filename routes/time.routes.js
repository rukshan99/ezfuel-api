const express = require('express');
const router = express.Router();

const timeController = require('../controllers/time.controller');

/*
* Defining endpoints for Time related controllers
*/
router.get('/times/averageWaitingTime/:shedId', timeController.getAverageWaitingTime);
router.put('/times/arrivals', timeController.updateArrivalTime);
router.put('/times/departures', timeController.updateDepartureTime);

module.exports = router;