'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const constants = require('../constants/controllers');
const searchConstants = require('../constants/controllers').questSearch;
const QueryBuilder = require('../libs/queryBuilder');
const errors = require('../libs/customErrors/errors');
const moment = require('moment');
moment.locale(constants.momentLanguage);

function getQuestObject(quest, req) {
    const questObj = quest.toObject();
    questObj.isMyQuest = quest.isMyQuest(req.user);
    questObj.dateOfCreation = moment(quest.dateOfCreation).format(constants.dateFormat);
    delete questObj.author.password;
    delete questObj.likes;
    questObj.author = quest.author.username;
    questObj.liked = quest.likedBy(req.user);
    questObj.likesCount = quest.likesCount;
    questObj.commentsCount = quest.comments.length;

    return questObj;
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
            let quest = await Quest.create(questData);
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
            let quest = await Quest.update(req.params.slug, questData);
            quest = getQuestObject(quest, req);

            res.status(httpStatus.OK).send({data: quest});
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }
    },

    async getQuests(req, res) {
        let quests = await Quest.getAll();
        quests = quests.map(quest => getQuestObject(quest, req));

        res.status(httpStatus.OK).send({data: quests});
    },

    async getQuestBySlug(req, res, next) {
        let quest = await Quest.getBySlug(req.params.slug);
        if (quest === null) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        quest = getQuestObject(quest, req);

        res.status(httpStatus.OK).send({data: quest});
    },

    async removeQuest(req, res, next) {
        const status = await Quest.removeBySlug(req.params.slug);
        if (status.result.n === 0) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }

        res.status(httpStatus.OK).send();
    },

    async findQuests(req, res) {
        const searchPageNumber = req.body.page;
        const firstCardNumber = (searchPageNumber - 1) * searchConstants.cardsCount;
        const lastCardNumber = firstCardNumber + searchConstants.cardsCount;
        const buildData = await (new QueryBuilder())
            .applyFilters(req.body)
            .build();

        const quests = await Quest.search(buildData);
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
    },

    async renderAllQuests(req, res) {
        const quests = await Quest.getAll();
        const renderData = {
            title: constants.quest.title,
            isAuth: req.user ? 1 : 0,
            quests: quests.map(quest => getQuestObject(quest, req)),
            activePage: '/'
        };

        res.render('mainPage/mainPage', renderData);
    },

    async likeQuest(req, res, next) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (!quest) {
            return next(new errors.NotFoundError(constants.quest.questNotFoundErrorMessage));
        }
        await quest.like(req.user);

        res.status(httpStatus.OK).send();
    }
};
