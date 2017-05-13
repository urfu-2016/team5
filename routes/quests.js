'use strict';

const express = require('express');
const router = new express.Router();
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    const renderData = {
        isAuth: req.user ? 1 : 0,
        activePage: '/quests'
    };

    res.render('questsAll/quests-all', renderData);
});

router.get('/create', function (req, res) {
    const renderData = {
        activePage: '/quests/create',
        isAuth: req.user ? 1 : 0
    };

    res.render('createQuest/createQuest', renderData);
});

router.route('/:slug').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        if (questData) {
            const renderData = {
                title: questData.title,
                quest: questData,
                isAuth: req.user ? 1 : 0,
                isCreator: questData.isMyQuest(req.user)
            };

            res.render('questsId/quests-id', renderData);
        } else {
            res.render('notFound/notFound');
        }
    });
});

module.exports = router;
