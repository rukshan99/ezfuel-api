const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.post('/users', UserController.createUser);
router.post('/auth',UserController.authUser);

module.exports = router;