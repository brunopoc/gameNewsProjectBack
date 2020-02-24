'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');

const usersController = require('../controllers/users_controller');

router.post('/users/singin', usersController.login);
router.post('/users/singup', usersController.singup);
router.post('/users/forgetpassword', usersController.forgetpassword);
router.post('/users/resetpassword', usersController.resetpassword);
router.post('/users/confirmemail', usersController.confirmemail);

router.get('/users/myuser', authService.authorize,  usersController.myuser);
router.post('/users/update/likes', authService.authorize, usersController.updateLikedPosts);
router.post('/users/update/profile', authService.authorize, usersController.updateProfile);

router.get('/users/list/:page', authService.authorizeAdmin,  usersController.get);
router.post('/users/admin/blocked', authService.authorizeAdmin,  usersController.updateBlocked);

module.exports = router;