const express = require('express');
const router = express.Router();

const ShedController = require('../controllers/shed.controller');

router.post('/sheds', ShedController.createShed);
router.get('/sheds', ShedController.getAllSheds);
router.get('/sheds/:shedId', ShedController.getShedById);

module.exports = router;