const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.controller');

/*
* Defining endpoints for Admin related controllers
*/
router.get('/admin/getCountAllVehicles/:shedId', AdminController.getCountAllVehicles);

module.exports = router;