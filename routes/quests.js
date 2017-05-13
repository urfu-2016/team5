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
        activePage: '/quests/create'
    };

    res.render('createQuest/createQuest', renderData);
});

router.route('/:slug').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        if (questData) {
            const renderData = {
                isAuth: req.user ? 1 : 0,
                isCreator: questData.isMyQuest(req.user),
                isPlaying: 0,
                slug: questData.slug,
                title: questData.title
            };

            res.render('questsId/quests-id', renderData);
        } else {
            res.render('notFound/notFound');
        }
    });
});

router.route('/:slug/info').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        if (questData) {
            const renderData = {
                quest: {
                    title: questData.title,
                    city: questData.city,
                    description: questData.description,
                    author: questData.author,
                    createdAt: questData.dateOfCreation,
                    tags: questData.tags,
                    imagesCount: questData.images.length,
                    likesCount: questData.likesCount,
                    liked: req.user ? questData.likedBy(req.user) : false
                }
            };
            res.send(JSON.stringify(renderData));
        } else {
            res.send(JSON.stringify({}));
        }
    });
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

router.route('/:slug/beginPlay').post(function (req, res) {
    if (req.user) {
        Quest.getBySlug(req.params.slug).then(questData => {
            if (questData) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
