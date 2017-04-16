/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const constants = require('../constants/controllers');
const questsSearch = require('../controllers/questsSearch');
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    Quest.getAll().then(data => {
        const renderData = {
            title: constants.title,
            isUserAutorized: true,
            quests: data,
            activePage: '/'
        };

        res.render('mainPage/mainPage', renderData);
    });
});
router.get('/search', questsSearch.getFoundQuests);

module.exports = router;
