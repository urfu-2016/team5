/* eslint-disable new-cap */
// test

const express = require('express');
const router = express.Router();

const fs = require('fs');

const quest = fs.readFileSync('./mocks/quest.json');
const questData = JSON.parse(quest);
const questsController = require('../controllers/api/quests');

router.route('/api/quests')
    .get(questsController.getQuests)
    .post(questsController.createQuest);

router.route('/api/quests/:slug')
    .get(questsController.getQuestBySlug)
    .put(questsController.updateQuest)
    .delete(questsController.removeQuest);

router.get('/quests/:id', function (req, res) {
    // TODO: Нужно брать квест по req.id и рендерить в шаблоне quest
    res.render('questsId/quests-id', questData);
});

module.exports = router;
