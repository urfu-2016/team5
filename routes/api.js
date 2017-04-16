'use strict';

const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/api/users');
const questsController = require('../controllers/api/quests');

router.route('/users')
    .get(usersController.getUsers);

router.route('/users/:username')
    .get(usersController.getUserByUsername);

router.route('/quests')
    .get(questsController.getQuests)
    .post(questsController.createQuest);

router.route('/quests/:slug')
    .get(questsController.getQuestBySlug)
    .put(questsController.updateQuest)
    .delete(questsController.removeQuest);

module.exports = router;
