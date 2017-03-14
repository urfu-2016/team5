/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const questsCtrl = require('../controllers/quests');

/* Возвращаем конкретный квест */
router.get('/quests', questsCtrl.getQuests);
router.post('/quests', questsCtrl.createQuest);
router.get('/quests/:id', questsCtrl.getQuestById);
router.put('/quests/:id', questsCtrl.updateQuest);
router.delete('/quests/:id', questsCtrl.removeQuest);

module.exports = router;
