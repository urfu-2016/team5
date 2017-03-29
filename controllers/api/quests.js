<<<<<<< HEAD
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

        return resolveRequestPromise(Quest.create(quest), res, {successCode: HttpStatus.CREATED});
    },

    updateQuest(req, res) {
        const questData = {
            title: req.body.title,
            description: req.body.description,
            city: req.body.city,
            tags: req.body.tags
        };
        const promise = Quest.update(req.params.slug, questData);

        return resolveRequestPromise(promise, res);
    },

    getQuests: (req, res) => resolveRequestPromise(Quest.getAll(), res),

    getQuestBySlug: (req, res) => resolveRequestPromise(Quest.getBySlug(req.params.slug), res),

    removeQuest: (req, res) => resolveRequestPromise(Quest.removeBySlug(req.params.slug), res)

};
=======
'use strict';

const HttpStatus = require('http-status-codes');
const Quest = require('../../models/quest');
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
            slug: req.body.slug,
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
>>>>>>> Добавил апи пользователей (#60)
