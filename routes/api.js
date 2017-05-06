'use strict';

const express = require('express');
const router = new express.Router();

const usersController = require('../controllers/users');
const questsController = require('../controllers/quests');
const commentsController = require('../controllers/comments');
const authController = require('../controllers/auth');
const autocompleteController = require('../controllers/autocomplete');

router.route('/users')
    .get(usersController.getUsers);

router.route('/users/:username')
    .get(usersController.getUserByUsername);

router.route('/quests')
    .get(questsController.getQuests)
    .post(authController.authorizedOnly, questsController.createQuest);

router.route('/quests/:slug')
    .get(questsController.getQuestBySlug)
    .put(authController.authorizedOnly, questsController.updateQuest)
    .delete(authController.authorizedOnly, questsController.removeQuest);

router.route('/comments/:slug')
    .get(commentsController.getComments)
    .post(authController.authorizedOnly, commentsController.createComment);

router.route('/comments/:slug/:id')
    .get(commentsController.getCommentById)
    .delete(authController.authorizedOnly, commentsController.removeComment);

router.route('/comments/:slug/:id/like')
    .post(authController.authorizedOnly, commentsController.likeComment);

router.route('/autocomplete')
    .get(autocompleteController.getCities)
    .post(autocompleteController.getCities);

module.exports = router;
