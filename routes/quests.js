'use strict';

const express = require('express');
const router = new express.Router();
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    const renderData = {
        isAuth: req.user ? 1 : 0,
        activePage: '/quests',
        title: 'Все квесты'
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

router.route('/:slug').get(async function (req, res) {
    const quest = await Quest.getBySlug(req.params.slug);

    if (quest) {
        const started = req.user && req.user.getQuestStatus(quest.slug) ? 1 : 0;
        const renderData = {
            isAuth: req.user ? 1 : 0,
            isCreator: quest.isMyQuest(req.user),
            isPlaying: started,
            slug: quest.slug,
            title: quest.title
        };

        res.render('questsId/quests-id', renderData);
    } else {
        res.render('notFound/notFound');
    }
});

module.exports = router;
