const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.controller');

/*
* Defining endpoints for Admin related controllers
*/
router.get('/admin/countAllVehicles/:shedId', AdminController.getCountAllVehicles);
router.get('/admin/remainingFuelAmounts/:shedId', AdminController.getRemainingFuelAmounts);
router.get('/admin/purchaseOrders', AdminController.createPurchaseOrder);

module.exports = router;