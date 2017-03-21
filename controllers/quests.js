'use strict';

const Quest = require('../models/quest');
const slug = require('slug');
const shortid = require('shortid');
const HttpStatus = require('http-status-codes');

function getSuccessCallback(res, status) {
    return data => {
        res
            .status(status)
            .send({data, message: HttpStatus.getStatusText(status)});
    };
}

function getErrorCallback(res) {
    return err => {
        err.status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        res
            .status(err.status)
            .send({error: HttpStatus.getStatusText(err.status)});
    };
}

function throwErrorOnFalseValue(objectToCheck, httpStatus) {
    if (!objectToCheck) {
        throw createError(httpStatus);
    }
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
                throwErrorOnFalseValue(isMongoDuplicateKeyError,
                    HttpStatus.BAD_REQUEST);

                return false;
            })
            .then(data => {
                if (!data) {
                    quest.slug += shortid.generate();

                    return quest.save();
                }

                return data;
            })
            .then(getSuccessCallback(res, HttpStatus.CREATED))
            .catch(getErrorCallback(res));
    },
    getQuests(req, res) {
        Quest.find({})
            .exec()
            .then(getSuccessCallback(res, HttpStatus.OK))
            .catch(getErrorCallback(res));
    },
    getQuestBySlug(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

                return quest;
            })
            .then(getSuccessCallback(res, HttpStatus.OK))
            .catch(getErrorCallback(res));
    },
    updateQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

                return quest;
            })
            .then(quest => {
                quest.title = req.body.title;
                quest.description = req.body.description;
                quest.slug = req.body.slug;

                return quest.save();
            })
            .then(getSuccessCallback(res, HttpStatus.OK))
            .catch(getErrorCallback(res));
    },
    removeQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .then(quest => {
                throwErrorOnFalseValue(quest, HttpStatus.NOT_FOUND);

                return quest.remove();
            })
            .then(getSuccessCallback(res, HttpStatus.OK))
            .catch(getErrorCallback(res));
    }
};
