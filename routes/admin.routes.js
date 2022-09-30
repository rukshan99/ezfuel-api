const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/admin.controller');

/*
* Defining endpoints for Admin related controllers
*/
router.get('/admin/countAllVehicles/:shedId', AdminController.getCountAllVehicles);
router.get('/admin/remainingFuelAmounts/:shedId', AdminController.getRemainingFuelAmounts);
router.post('/admin/purchaseOrders', AdminController.createPurchaseOrder);
router.put('/admin/receiveFuel', AdminController.receiveFuel);

module.exports = router;