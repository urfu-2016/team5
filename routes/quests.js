'use strict';

const express = require('express');
const router = new express.Router();
const Quest = require('../models/quest');

router.get('/', function (req, res) {
    const renderData = {
        activePage: '/quests'
    };

    res.render('questsAll/quests-all', renderData);
});

router.route('/:slug').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        if (questData) {
            const renderData = {
                title: questData.title,
                quest: questData,
                isAuth: req.user ? 1 : 0, // TODO: Убрать эти заглушки
                isCreator: false  // TODO: Убрать эти заглушкиs
            };

            res.render('questsId/quests-id', renderData);
        } else {
            res.render('notFound/notFound');
        }
    });
});

module.exports = router;
