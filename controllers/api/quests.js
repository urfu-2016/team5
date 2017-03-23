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

        return Quest.create(quest)
            .then(baseApi.getSuccessCallback(res, HttpStatus.CREATED))
            .catch(baseApi.getErrorCallback(res, HttpStatus.NOT_FOUND));
    },

    getQuests(req, res) {
        return Quest.getAll()
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res, HttpStatus.NOT_FOUND));
    },

    getQuestBySlug(req, res) {
        return Quest.getBySlug(req.params.slug)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res, HttpStatus.NOT_FOUND));
    },

    updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description
        };
        return Quest.update(req.body.slug, questData)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res, HttpStatus.NOT_FOUND));
    },

    removeQuest(req, res) {
        return Quest.removeBySlug(req.params.slug)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res, HttpStatus.NOT_FOUND));
    }
};
