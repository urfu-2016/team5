/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const questsSearch = require('../controllers/questsSearch');
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    Quest.getAll().then(data => {
        const renderData = {
            title: 'Список квестов',
            quests: data
        };

        res.render('questsAll/quests-all', renderData);
    });
});
router.get('/search', questsSearch.getFoundQuests);

module.exports = router;
