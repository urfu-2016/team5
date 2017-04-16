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
        quests: [
            {
                image: 'http://cdn-image.travelandleisure.com/sites/default/files/styles/1600x1000/public/1446151328/miami-header-dg1015.jpg?itok=eIwFd7q_',
                title: 'Miami beach',
                text: 'Go hard play hard',
                creationDate: '16.04.2017',
                commentsCount: '228',
                likesCount: '1337'
            },
            {
                image: 'http://www.wantseeproject.com/wp-content/uploads/2016/05/las-vegas-strip.jpg',
                title: 'Las Vegas',
                text: 'All that was in vegas, remains in Vegas',
                creationDate: '15.04.2017',
                commentsCount: '1',
                likesCount: '15'
            },
            {
                image: 'https://static1.squarespace.com/static/53dbe339e4b0c5353844bc99/t/58176703c534a576aa3d9d46/1477928713235/',
                title: 'Washington',
                text: 'Become president of this country',
                creationDate: '14.04.2017',
                commentsCount: '0',
                likesCount: '0'
            }
        ]
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
