'use strict';

const express = require('express');
const authService = require('../services/auth-service');
const router = express.Router();

const postsController = require('../controllers/posts_controller');

router.post('posts/', authService.authorize, postsController.post);
router.get('posts/list', authService.authorize,  postsController.get);
router.put('posts/:id', authService.authorize, postsController.put);

module.exports = router;