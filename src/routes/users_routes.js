'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');

const usersController = require('../controllers/users_controller');

router.get('/users/list', authService.authorize,  usersController.get);
router.post('/users/singin', usersController.login);
router.post('/users/singup', usersController.singup);

module.exports = router;