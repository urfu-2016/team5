/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const questsCtrl = require('../controllers/quests');

/* Возвращаем конкретный квест */
router.get('/quests', questsCtrl.getQuests);
router.post('/quests', questsCtrl.createQuest);
router.get('/quests/:slug', questsCtrl.getQuestBySlug);
router.put('/quests/:slug', questsCtrl.updateQuest);
router.delete('/quests/:slug', questsCtrl.removeQuest);

module.exports = router;
