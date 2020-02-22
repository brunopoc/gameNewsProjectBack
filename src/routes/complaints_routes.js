'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/auth-service');
const complaintsController = require('../controllers/complaints_controller');

router.post('/complaints/add/', complaintsController.post);
router.get('/complaints/list/:page', authService.authorizeAdmin, complaintsController.get);

module.exports = router;