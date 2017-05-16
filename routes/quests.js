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
        action: 'Создание квеста',
        submitButton: {
            text: 'Создать',
            role: 'createQuest'
        },
        quest: {
            userCount: 0 // Костыль
        },
        isAuth: req.user ? 1 : 0
    };

    res.render('createQuest/createQuest', renderData);
});

router.route('/:slug').get(async function (req, res) {
    const quest = await Quest.getBySlug(req.params.slug);

    if (quest) {
        const started = req.user && req.user.getQuestStatus(quest.slug);
        const finished = req.user && res.user.getPhotoStatuses(quest).every(x => x.status);
        const renderData = {
            isAuth: req.user ? 1 : 0,
            isCreator: quest.isMyQuest(req.user) ? 1 : 0,
            isPlaying: started ? 1 : 0,
            isFinished: finished ? 1 : 0,
            slug: quest.slug,
            title: quest.title
        };

        res.render('questsId/quests-id', renderData);
    } else {
        res.render('notFound/notFound');
    }
});

router.route('/:slug/edit').get(function (req, res) {
    Quest.getBySlug(req.params.slug).then(questData => {
        const isCreator = questData.isMyQuest(req.user);
        // Добавить isCreator в условие
        if (questData) {
            const renderData = {
                title: questData.title,
                quest: questData,
                submitButton: {
                    text: 'Изменить',
                    role: 'editQuest'
                },
                action: 'Редактирование квеста',
                isAuth: req.user ? 1 : 0,
                isCreator: isCreator ? 1 : 0
            };

            res.render('createQuest/createQuest', renderData);
        } else {
            res.render('notFound/notFound');
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
                Quest.addPlayingUser(req.params.slug);
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
