'use strict';

const express = require('express');
const router = new express.Router();
const constants = require('../constants/controllers');
const questsSearch = require('../controllers/questsSearch');
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    Quest.getAll().then(data => {
        const renderData = {
            title: constants.title,
            quests: data
        };

        res.render('questsAll/quests-all', renderData);
    });
});

router.get('/search', questsSearch.getFoundQuests);

module.exports = router;
