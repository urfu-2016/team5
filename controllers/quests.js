'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const resolveRequestPromise = require('./baseApi').resolveRequestPromise;
const constants = require('../constants/controllers').quest;
const searchConstants = require('../constants/controllers').questSearch;
const QueryBuilder = require('../libs/queryBuilder');
const errors = require('../../libs/customErrors/errors');

function isMyQuest(quest, req) {
    return req.user ? (req.user._id.equals(quest.author)) : false;
}

// FIXME Не знаю как ее назвать адекватнее.
function getQuestWithNewProps(quest, pairs) {
    quest = quest.toObject();
    pairs.forEach(pair => {
        quest[pair.property] = pair.value;
    });

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

        try {
            const quest = await Quest.create(questData);
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
            await Quest.update(req.params.slug, questData);
            res.status(httpStatus.OK).send({data: questData});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async getQuests(req, res) {
        const quests = await Quest.getAll();
        res.status(httpStatus.OK).send({data: quests});
    },

    async getQuestBySlug(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (quest === null) {
            return next(new errors.NotFoundError(constants.questNotFoundErrorMessage));
        }

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
                    .map(quest => {
                        const pairs = [{
                            property: 'isMyQuest',
                            value: isMyQuest(quest, req)
                        }];

                        return getQuestWithNewProps(quest, pairs);
                    });

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

        Quest.getAll()
            .then(data => {
                const renderData = {
                    title: constants.title,
                    user: {
                        avatar: 'http://www.lovemarks.com/wp-content/uploads/profile-avatars/default-avatar-knives-ninja.png'
                    },
                    quests: data.map(quest => {
                        // FIXME Слишком большой объект
                        const pairs = [
                            {
                                property: 'isMyQuest',
                                value: isMyQuest(quest, req)
                            },
                            {
                                property: 'dateOfCreation',
                                value: quest.dateOfCreation.toString()
                            }
                        ];

                        return getQuestWithNewProps(quest, pairs);
                    }),
                    activePage: '/'
                };

                res.render('mainPage/mainPage', renderData);
            });
    }
};
