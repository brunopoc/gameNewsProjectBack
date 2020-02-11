'use strict';

const express = require('express');
const authService = require('../services/auth-service');
const router = express.Router();
const postsController = require('../controllers/posts_controller');
const multer = require("multer");
const multerConfig = require("../config/multer");

router.post('/posts/uploadImage/', multer(multerConfig).single('upload'), postsController.postFile);
router.get('/posts/list/:page', postsController.get);
router.post('/posts/', authService.authorize, postsController.post);
router.post('/posts/addCategorie', authService.authorize, postsController.addCategorie);
router.get('/posts/listCategories', authService.authorize, postsController.getCategories);
router.get('/posts/article/:refer', postsController.getOne);
router.put('/posts/:id', authService.authorize, postsController.put);

module.exports = router;