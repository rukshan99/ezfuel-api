const express = require('express');
const router = express.Router();

const ShedController = require('../controllers/shed.controller');

/*
* Defining endpoints for Shed related controllers
*/
router.post('/sheds', ShedController.createShed);
router.get('/sheds', ShedController.getAllSheds);
router.get('/sheds/:district/:city', ShedController.getAllShedsByLocation);
router.get('/sheds/:shedId', ShedController.getShedById);
router.put( '/sheds/sales', ShedController.recordSale);

module.exports = router;