/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();

const questsController = require('../controllers/api/quests');
const Quest = require('../models/quest');

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
