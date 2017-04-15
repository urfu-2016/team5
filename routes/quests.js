/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const constants = require('../constants/controllers');
const questsController = require('../controllers/api/quests');
const Quest = require('../models/quest');

router.get('/quests', function (req, res) {
    Quest.getAll().then(data => {
        const renderData = {
            title: constants.title,
            quests: data
        };

        res.render('questsAll/quests-all', renderData);
    });
});

router.route('/quests/:slug').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        const renderData = {
            title: 'Квест',
            quest: questData,
            isAuth: true, // TODO: Убрать эти заглушки
            isCreator: false  // TODO: Убрать эти заглушки
        };

        res.render('questsId/quests-id', renderData);
    });
});

router.route('/api/quests')
    .get(questsController.getQuests)
    .post(questsController.createQuest);

router.route('/api/quests/:slug')
    .get(questsController.getQuestBySlug)
    .put(questsController.updateQuest)
    .delete(questsController.removeQuest);

module.exports = router;
