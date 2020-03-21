'use strict';

const express = require('express');
const authService = require('../services/auth-service');
const router = express.Router();
const postsController = require('../controllers/posts_controller');
const multer = require("multer");
const multerConfig = require("../config/multer");

router.get('/posts/article/:refer', postsController.getOne);
router.get('/posts/list/:page', postsController.get);
router.get('/posts/category/:category/:page', postsController.getByCategory);
router.get('/posts/tag/:tags/:page', postsController.getByTags);
router.get('/posts/listCategories', postsController.getCategories);
router.get('/posts/similar/:category', postsController.getSimilar);
router.get('/posts/mostviewsinweek', postsController.getmostViewedsInWeek);
router.get('/posts/mostlikedinweek', postsController.getmostLikedInWeek);
router.get('/posts/highlights', postsController.getHighlights);
router.post('/posts/uploadImage/', multer(multerConfig).single('upload'), postsController.postFile);

router.get('/posts/personal/:page', authService.authorize, postsController.getPersonal);
router.post('/posts/', authService.authorize, postsController.post);
router.post('/posts/like/:id', authService.authorize, postsController.updateLikes);
router.post('/posts/comment/:id', authService.authorize, postsController.postComment);
router.post('/posts/addCategorie', authService.authorize, postsController.addCategorie);

router.get('/posts/all/:page', authService.authorizeAdmin, postsController.getAll);
router.get('/posts/pending/:page', authService.authorizeAdmin, postsController.getPending);
router.post('/posts/aprove/:id', authService.authorizeAdmin, postsController.updatePendingPost);

module.exports = router;