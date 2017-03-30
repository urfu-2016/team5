'use strict';

const HttpStatus = require('http-status-codes');
const Quest = require('../../models/quest');
const baseApi = require('./baseApi');

module.exports = {
    createQuest(req, res) {
        const quest = {
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug
        };

        return baseApi.resolveRequestPromise(Quest.create(quest), res, HttpStatus.CREATED);
    },

    updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description
        };
        const promise = Quest.update(req.body.slug, questData);

        return baseApi.resolveRequestPromise(promise, res);
    },

    getQuests: (req, res) => baseApi.resolveRequestPromise(Quest.getAll(), res),

    getQuestBySlug: (req, res) => baseApi.resolveRequestPromise(Quest.getBySlug(req.params.slug), res),

    removeQuest: (req, res) => baseApi.resolveRequestPromise(Quest.removeBySlug(req.params.slug), res)
};
