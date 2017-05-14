'use strict';

const express = require('express');
const router = new express.Router();

const usersController = require('../controllers/users');
const questsController = require('../controllers/quests');
const commentsController = require('../controllers/comments');
const authController = require('../controllers/auth');
const autocompleteController = require('../controllers/autocomplete');
const stagesController = require('../controllers/stages');
const upload = require('../libs/multer').upload;
const getAction = require('../libs/getAction');

router.route('/users')
    .get(getAction(usersController, 'getUsers'));

router.route('/users/:username')
    .get(getAction(usersController, 'getUserByUsername'));

router.route('/quests')
    .get(getAction(questsController, 'getQuests'))
    .post(getAction(authController, 'authorizedOnly'), getAction(questsController, 'createQuest'));

router.route('/quests/:slug')
    .get(getAction(questsController, 'getQuestBySlug'))
    .put(getAction(authController, 'authorizedOnly'), getAction(questsController, 'updateQuest'))
    .delete(getAction(authController, 'authorizedOnly'), getAction(questsController, 'removeQuest'));

router.route('/quests/:slug/like')
    .post(getAction(authController, 'authorizedOnly'), getAction(questsController, 'likeQuest'));

router.route('/quests/:slug/start')
    .post(authController.authorizedOnly, questsController.startQuest);

router.route('/quests/:slug/info')
    .get(questsController.getInfo);

router.route('/quests/:slug/photos')
    .get(authController.authorizedOnly, questsController.getPhotoStatuses);

router.route('/quests/:slug/photos/:id/check')
    .post(authController.authorizedOnly, questsController.checkPhoto);

router.route('/comments/:slug')
    .get(getAction(commentsController, 'getComments'))
    .post(getAction(authController, 'authorizedOnly'), getAction(commentsController, 'createComment'));

router.route('/comments/:slug/:id')
    .get(getAction(commentsController, 'getCommentById'))
    .delete(getAction(authController, 'authorizedOnly'), getAction(commentsController, 'removeComment'));

router.route('/comments/:slug/:id/like')
    .post(getAction(authController, 'authorizedOnly'), getAction(commentsController, 'likeComment'));

router.route('/autocomplete')
    .get(getAction(autocompleteController, 'getCities'))
    .post(getAction(autocompleteController, 'getCities'));

router.route('/quests/:slug/stages')
    .post(getAction(authController, 'authorizedOnly'), upload.single('image'), getAction(stagesController, 'add'))
    .get(getAction(stagesController, 'getAllByQuest'));

router.route('/quests/:slug/stages/:stageId')
    .put(getAction(authController, 'authorizedOnly'), upload.single('image'), getAction(stagesController, 'update'))
    .delete(getAction(authController, 'authorizedOnly'), getAction(stagesController, 'remove'));

router.route('/stages/:stageId')
    .get(getAction(stagesController, 'getById'));

module.exports = router;
