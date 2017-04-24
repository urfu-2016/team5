'use strict';

const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/users');
const questsController = require('../controllers/quests');
const authController = require('../controllers/auth');

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

module.exports = router;
