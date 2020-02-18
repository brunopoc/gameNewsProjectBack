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
router.post('/posts/like/:id', authService.authorize, postsController.updateLikes);
router.post('/posts/comment/:id', authService.authorize, postsController.postComment);
router.get('/posts/pending/:page', authService.authorizeAdmin, postsController.getPending);
router.post('/posts/aprove/:id', authService.authorizeAdmin, postsController.updatePendingPost);
router.get('/posts/all/:page', authService.authorizeAdmin, postsController.getAll);

module.exports = router;