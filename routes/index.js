/* eslint-disable new-cap */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const quests = fs.readFileSync('./mocks/quests.json', 'utf-8');
const questsData = JSON.parse(quests);

/* Список квестов */
router.get('/', function (req, res) {
    // Брать из базы
    res.render('questsAll/quests-all', questsData);
});

module.exports = router;
