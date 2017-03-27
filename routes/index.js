/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const quests = fs.readFileSync('./mocks/quests.json', 'utf-8');
const questsData = JSON.parse(quests);
const questsSearchController = require('../controllers/questsSearch');

/* Список квестов */
router.get('/', function (req, res) {
    // Брать из базы
    res.render('questsAll/quests-all', questsData);
});
router.get('/search', questsSearchController.getFoundQuests);

module.exports = router;
