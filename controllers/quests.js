'use strict';
const Quest = require('../models/quest');
const slug = require('slug');
const shortid = require('shortid');

function getSuccessCallback(res, status, message) {
    return data => {
        res.status(status).send({data, message});
    };
}
function getErrorCallback(res) {
    return err => {
        err.status = err.status || 500;
        err.message = err.message || 'Server error';
        res.status(err.status).send({error: err.message});
    };
}

function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

module.exports = {
    createQuest(req, res) {
        const quest = new Quest({
            title: req.body.title,
            description: req.body.description,
            slug: slug(req.body.slug)
        });
        return quest
            .save()
            .catch(err => {
                const isMongoDuplicateKeyError = err.name === 'MongoError' &&
                    err.code === 11000;
                if (!isMongoDuplicateKeyError) {
                    throw createError(400, 'Badrequest');
                }

                return false;
            })
            .then(data => {
                if (!data) {
                    quest.slug += shortid.generate();
                    return quest.save();
                }

                return data;
            })
            .then(getSuccessCallback(res, 201, 'Created'))
            .catch(getErrorCallback(res));
    },
    getQuests(req, res) {
        Quest.find({})
            .exec()
            .then(getSuccessCallback(res, 200, 'OK'))
            .catch(getErrorCallback(res));
    },
    getQuestBySlug(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                if (!quest) {
                    throw createError(404, 'Not Found');
                }

                return quest;
            })
            .then(getSuccessCallback(res, 200, 'OK'))
            .catch(getErrorCallback(res));
    },
    updateQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                if (!quest) {
                    throw createError(404, 'Not Found');
                }

                return quest;
            })
            .then(quest => {
                quest.title = req.body.title;
                quest.description = req.body.description;
                quest.slug = req.body.slug;
                return quest.save();
            })
            .then(getSuccessCallback(res, 200, 'OK'))
            .catch(getErrorCallback(res));
    },
    removeQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .then(quest => {
                if (!quest) {
                    throw createError(404, 'Not Found');
                }

                return quest.remove();
            })
            .then(getSuccessCallback(res, 200, 'OK'))
            .catch(getErrorCallback(res));
    }
};
