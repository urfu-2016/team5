/* eslint-disable new-cap */
'use strict';

const express = require('express');
const router = express.Router();
const constants = require('../constants/controllers');
const questsSearch = require('../controllers/questsSearch');
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    /*
    Const renderData = {
        title: constants.title,
        activePage: '/',
        user: {
            avatar: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-knives-ninja.png'
        },
    };

    res.render('mainPage/mainPage', renderData);
    */

    Quest.getAll().then(data => {
        const renderData = {
            title: constants.title,
            user: {
                avatar: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-knives-ninja.png'
            },
            quests: data.map(q => {
                q.dateOfCreation = q.dateOfCreation.getDate();
                return q;
            }),
            activePage: '/'
        };

        res.render('mainPage/mainPage', renderData);
    });
});
router.get('/search', questsSearch.getFoundQuests);

module.exports = router;
