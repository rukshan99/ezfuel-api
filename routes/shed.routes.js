const express = require('express');
const router = express.Router();

const ShedController = require('../controllers/shed.controller');

router.post('/sheds', ShedController.createShed);
router.get('/sheds',ShedController.getAllSheds);

module.exports = router;