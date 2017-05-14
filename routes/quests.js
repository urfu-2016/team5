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

router.route('/:slug/photos').get(function (req, res) {
    if (req.user) {
        Quest.getBySlug(req.params.slug).then(questData => {
            if (questData) {
                const photos = questData.images.map(image => ({
                    src: image.src,
                    answered: false,
                    rightAnswered: false,
                    id: 1
                }));
                res.send(JSON.stringify(photos));
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
