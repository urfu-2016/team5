'use strict';
const Quest = require('../models/quest');

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
            description: req.body.description
        });
        return quest
            .save()
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    getQuests(req, res) {
        Quest.find({})
            .exec()
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    getQuestById(req, res) {
        Quest.findById(req.params.id)
            .exec()
            .then(getSuccessCallback(res))
            .catch(getErrorCallback(res));
    },
    updateQuest(req, res) {
        Quest.findById(req.params.id)
            .exec()
            .then(quest => {
                quest.title = req.body.title;
                quest.description = req.body.description;
                return quest.save();
            })
            .then(getSuccessCallback(res, 'Quest updated!'))
            .catch(getErrorCallback(res));
    },
    removeQuest(req, res) {
        Quest.findById(req.params.id)
            .exec()
            .then(quest => {
                quest.remove();
            })
            .then(getSuccessCallback(res, 'Quest removed!'))
            .catch(getErrorCallback(res));
    }
};
