'use strict';

const HttpStatus = require('http-status-codes');
const Quest = require('../../models/quest');
const resolveRequestPromise = require('./baseApi').resolveRequestPromise;

module.exports = {
    createQuest(req, res) {
        const quest = {
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug
        };

        return resolveRequestPromise(Quest.create(quest), res, HttpStatus.CREATED);
    },

    updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description
        };
        const promise = Quest.update(req.body.slug, questData);

        return resolveRequestPromise(promise, res);
    },

    getQuests: (req, res) => resolveRequestPromise(Quest.getAll(), res),

    getQuestBySlug: (req, res) => resolveRequestPromise(Quest.getBySlug(req.params.slug), res),

    removeQuest: (req, res) => resolveRequestPromise(Quest.removeBySlug(req.params.slug), res)
};
