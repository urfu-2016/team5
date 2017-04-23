'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const resolveRequestPromise = require('./baseApi').resolveRequestPromise;
const constants = require('../constants/controllers').quest;
const searchConstants = require('../constants/controllers').questSearch;
const QueryBuilder = require('../libs/queryBuilder');
const errors = require('../../libs/customErrors/errors');

function isMyQuest(quest, user) {
    return user ? (user._id.equals(quest.author)) : false;
}

function getQuestObject(quest, req) {
    quest = quest.toObject();
    quest.isMyQuest = isMyQuest(quest, req.user);
    quest.dateOfCreation = quest.dateOfCreation.getDate();

    return quest;
}

module.exports = {
    async createQuest(req, res, next) {
        const questData = {
            title: req.body.title,
            description: req.body.description,
            authorId: req.user.id,
            city: req.body.city,
            tags: req.body.tags
        };

<<<<<<< 4b8d15b8e3b453535e5e0faee81704451d40fac4
        try {
            const quest = await Quest.create(questData);
            quest = getQuestObject(quest, req);

            res.status(httpStatus.CREATED).send({data: quest});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async updateQuest(req, res, next) {
        const questData = {
            slug: req.body.slug,
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            tags: req.body.tags
        };

        try {
            const quest = await Quest.update(req.params.slug, questData);
            quest = getQuestObject(quest, req);

            res.status(httpStatus.OK).send({data: quest});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async getQuests(req, res) {
        const quests = await Quest.getAll();
        quests = quests.map(quest => getQuestObject(quest, req));

        res.status(httpStatus.OK).send({data: quests});
    },

    async getQuestBySlug(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (quest === null) {
            return next(new errors.NotFoundError(constants.questNotFoundErrorMessage));
        }
        quest = getQuestObject(quest, req);

        res.status(httpStatus.OK).send({data: quest});
    },

    async removeQuest(req, res, next) {
        const status = await Quest.removeBySlug(req.params.slug);
        if (status.result.n === 0) {
            return next(new errors.NotFoundError(constants.questNotFoundErrorMessage));
        }

        res.status(httpStatus.OK).send();
    }

    findQuests(req, res) {
        return (new QueryBuilder())
            .applyFilters(req.body)
            .build()
            .then(buildData => Quest.search(buildData))
            .then(quests => {
                const searchPageNumber = req.body.page;
                const firstCardNumber = (searchPageNumber - 1) * searchConstants.cardsCount;
                const lastCardNumber = firstCardNumber + searchConstants.cardsCount;
                const renderQuests = quests
                    .slice(firstCardNumber, lastCardNumber)
                    .map(quest => getQuestObject(quest, req));

                const renderData = {
                    pageNumber: searchPageNumber,
                    maxPageNumber: Math.ceil(quests.length / searchConstants.cardsCount),
                    title: searchConstants.title,
                    quests: renderQuests,
                    isEmptyQuests: quests.length === 0
                };

                res.send(renderData);
            });
    },

    renderAllQuests(req, res) {
        Quest.getAll()
            .then(data => {
                const renderData = {
                    title: constants.title,
                    user: {
                        avatar: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-knives-ninja.png'
                    },
                    quests: data.map(quest => getQuestObject(quest, req)),
                    activePage: '/'
                };

                res.render('mainPage/mainPage', renderData);
            });
    }
};
