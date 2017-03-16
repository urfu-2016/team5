'use strict';
const Quest = require('../models/quest');
const slug = require('slug');
const shortid = require('shortid');

function getSuccessCallback(res, message) {
    return data => {
        message = message || 'Successful operation!';
        console.log(data);
        res.send({data, message});
    };
}
function getErrorCallback(res) {
    return err => {
        res.send(err);
    };
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
                    throw err;
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
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    getQuests(req, res) {
        Quest.find({})
            .exec()
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    getQuestBySlug(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    updateQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                quest.title = req.body.title;
                quest.description = req.body.description;
                quest.slug = req.body.slug;
                return quest.save();
            })
            .then(getSuccessCallback(res, 'Quest updated!'))
            .catch(getErrorCallback(res));
    },
    removeQuest(req, res) {
        Quest.findOne({slug: req.params.slug})
            .exec()
            .then(quest => {
                quest.remove();
            })
            .then(getSuccessCallback(res, 'Quest removed!'))
            .catch(getErrorCallback(res));
    }
};
