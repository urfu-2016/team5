/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const questsCtrl = require('../controllers/quests');

/* Возвращаем конкретный квест */
router.route('/quest/:id')
    .get(function (req, res) {
    // Нужно брать квест по req.id и рендерить в шаблоне quest
        res.render('quest', {title: 'Квест'});
    });
router.route('/api/quests')
    .get(questsCtrl.getQuests)
    .post(questsCtrl.createQuest);
router.route('/api/quests/:slug')
    .get(questsCtrl.getQuestBySlug)
    .put(questsCtrl.updateQuest)
    .delete(questsCtrl.removeQuest);

module.exports = router;
