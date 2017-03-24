'use strict';
const Quest = require('../../models/quest');
const HttpStatus = require('http-status-codes');
const baseApi = require('./baseApi');

module.exports = {
    createQuest(req, res) {
        const quest = {
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug || ''
        };

        return Quest.create(quest)
            .then(baseApi.getSuccessCallback(res, HttpStatus.CREATED))
            .catch(baseApi.getErrorCallback(res));
    },

    getQuests(req, res) {
        Quest.find({})
            .exec()
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    },

    getQuestBySlug(req, res) {
        Quest.getBySlug(req.params.slug)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    },

    updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description,
            slug: req.body.slug
        };
        Quest.update(questData)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    },

    removeQuest(req, res) {
        Quest.removeBySlug(req.params.slug)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    }
};
