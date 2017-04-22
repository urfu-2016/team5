'use strict';

const httpStatus = require('http-status-codes');
const Quest = require('../../models/quest');
const constants = require('../../constants/controllers').quest;
const errors = require('../../libs/customErrors/errors');

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

    async getQuests(req, res, next) {
        const quests = await Quest.getAll();
        if (quests.length === 0) {
            return next(new errors.BadRequestError(constants.questNotFoundErrorMessage));
        }

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
};
