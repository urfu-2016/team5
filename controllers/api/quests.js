'use strict';

const HttpStatus = require('http-status-codes');
const Quest = require('../../models/quest');
const resolveRequestPromise = require('./baseApi').resolveRequestPromise;

module.exports = {
    createQuest(req, res) {
        const quest = {
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            city: req.body.city,
            tags: req.body.tags
        };

        return Quest
            .create(quest)
            .then(quest => () => quest)
            .catch(err => () => {
                throw err;
            })
            .then(resultCallback => resolveRequestPromise(resultCallback, res, {successCode: HttpStatus.CREATED}));
    },

    updateQuest(req, res) {
        const questData = {
            slug: req.body.slug,
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            tags: req.body.tags
        };

        return Quest
            .update(req.params.slug, questData)
            .then(res => () => res)
            .catch(err => () => {
                throw err;
            })
            .then(resultCallback => resolveRequestPromise(resultCallback, res));
    },

    getQuests(req, res) {
        return Quest
            .getAll()
            .then(quests => {
                return quests.length === 0 ? () => {
                    throw new Error('Quests was not found');
                } : () => quests;
            })
            .then(resultCallback => resolveRequestPromise(resultCallback, res));
    },

    getQuestBySlug(req, res) {
        return Quest
            .getBySlug(req.params.slug)
            .then(quest => {
                return quest === null ? () => {
                    throw new Error('Quests wasn\'t found');
                } : () => quest;
            })
            .then(resultCallback => resolveRequestPromise(resultCallback, res));
    },

    removeQuest(req, res) {
        return Quest
            .removeBySlug(req.params.slug)
            .then(res => {
                return res.result.n === 0 ? () => {
                    throw new Error('Quests wasn\'t found');
                } : () => res;
            })
            .then(resultCallback => resolveRequestPromise(resultCallback, res));
    }
};
