'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../models/quest');
const User = require('../models/user');
const constants = require('../constants/controllers');
const searchConstants = require('../constants/controllers').questSearch;
const QueryBuilder = require('../libs/queryBuilder');
const {NotFoundError, BadRequestError} = require('../libs/customErrors/errors');
const moment = require('moment');
moment.locale(constants.momentLanguage);

async function getQuestObject(req, quest) {
    const stages = await quest.getStages();
    const questObj = quest.toObject();
    questObj.images = stages;
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

function compareDate(firstQuest, secondQuest) {
    const firstDate = moment(firstQuest.dateOfCreation);
    const secondDate = moment(secondQuest.dateOfCreation);

    return moment(firstDate).isBefore(secondDate);
}

function comparePopularity(firstQuest, secondQuest) {
    return firstQuest.likesCount < secondQuest.likesCount;
}

module.exports = {
    async createQuest(req, res) {
        const stages = req.body.stages;
        const questData = {
            title: req.body.title,
            description: req.body.description,
            authorId: req.user.id,
            city: req.body.city,
            tags: req.body.tags,
            stages: stages ? stages : []
        };
        try {
            let quest = await Quest.create(questData);
            quest = await getQuestObject(req, quest);

            res.status(httpStatus.CREATED).send({data: quest});
        } catch (err) {
            throw new BadRequestError(err.message);
        }
    },

    async updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            tags: req.body.tags
        };

        try {
            let quest = await Quest.update(req.params.slug, questData);
            quest = await getQuestObject(req, quest);

            res.status(httpStatus.OK).send({data: quest});
        } catch (err) {
            throw new BadRequestError(err.message);
        }
    },

    async getQuests(req, res) {
        let quests = await Quest.getAll();
        quests = await Promise.all(quests.map(quest => getQuestObject(req, quest)));

        res.status(httpStatus.OK).send({data: quests});
    },

    async getQuestBySlug(req, res) {
        let quest = await Quest.getBySlug(req.params.slug);
        if (quest === null) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }
        quest = await getQuestObject(req, quest);

        res.status(httpStatus.OK).send({data: quest});
    },

    async removeQuest(req, res) {
        const quest = await Quest.removeBySlug(req.params.slug);

        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
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
        let renderQuests = quests.slice(firstCardNumber, lastCardNumber);
        renderQuests = await Promise.all(
            renderQuests.map(quest => getQuestObject(req, quest))
        );

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
        let quests = await Quest.getAll();
        quests = await Promise.all(
            quests.map(quest => getQuestObject(req, quest))
        );

        const renderData = {
            title: constants.quest.title,
            isAuth: req.user ? 1 : 0,
            quests: quests
                .sort(compareDate)
                .slice(0, 3),
            popularQuests: quests
                .sort(comparePopularity)
                .slice(0, 3),
            createdQuests: quests
                .filter(quest => quest.isMyQuest(req.user)),
            activePage: '/'
        };

        res.render('mainPage/mainPage', renderData);
    },

    async likeQuest(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }
        await quest.like(req.user);

        res.status(httpStatus.OK).send();
    },

    async startQuest(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }
        if (await req.user.startQuest(quest)) {
            res.status(httpStatus.OK).send();
        } else {
            res.status(httpStatus.BAD_REQUEST).send();
        }
    },

    async getPhotoStatuses(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }

        res.send({
            data: await req.user.getPhotoStatuses(quest)
        });
    },

    async checkPhoto(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);
        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }

        const location = req.body;
        const position = Number(req.params.id);
        let user = await User.findById(req.user.id);
        await quest.checkPhoto(user, position, location);

        user = await User.findById(req.user.id);
        res.send(await user.getStatus(req.params.slug, position));
    },

    async getInfo(req, res) {
        const quest = await Quest.getBySlug(req.params.slug);

        if (!quest) {
            throw new NotFoundError(constants.quest.questNotFoundErrorMessage);
        }

        res.send({
            quest: {
                title: quest.title,
                city: quest.city,
                description: quest.description,
                author: quest.author,
                createdAt: quest.dateOfCreation,
                tags: quest.tags,
                imagesCount: quest.stages.length,
                likesCount: quest.likesCount,
                liked: quest.likedBy(req.user),
                slug: quest.slug
            }
        });
    }
};
