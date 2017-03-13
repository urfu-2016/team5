'use strict';
const Quest = require('../models/quest');

module.exports = {
    createQuest: (req, res) => {
        const quest = new Quest({
            title: req.body.title,
            description: req.body.description
        });
        quest.save((err) => {
            if (!err) {
                return res.send({ status: 'OK', quest });
            } else {
                if(err.name === 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
            }
        });
    },
    getQuests: (req, res) => {
        return Quest.find((err, quests) => {
            if (!err) {
                return res.send(quests);
            } else {
                res.statusCode = 500;

                return res.send({ error: 'Server error' });
            }
        });
    },
    getQuestById: (req, res) => {
        return Quest.findById(req.params.id, function (err, quest) {
            if(!quest) {
                res.statusCode = 404;

                return res.send({ error: 'Not found' });
            }
            if (!err) {
                return res.send({ status: 'OK', _id: quest.id });
            } else {
                res.statusCode = 500;

                return res.send({ error: 'Server error' });
            }
        });
    },
    updateQuest: (req, res) => {
        return Quest.findById(req.params.id, function (err, quest) {
            if(!quest) {
                res.statusCode = 404;

                return res.send({ error: 'Not found' });
            }
            quest.title = req.body.title;
            quest.description = req.body.description;

            return quest.save(function (err) {
                if (!err) {
                    return res.send({ status: 'OK', quest:quest, message: 'Quest updated!'});
                } else {
                    if(err.name === 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                }
            });
        });
    },
    removeQuest: (req, res) => {
        return Quest.findById(req.params.id, function (err, quest) {
            if(!quest) {
                res.statusCode = 404;

                return res.send({ error: 'Not found' });
            }

            return quest.remove(function (err) {
                if (!err) {
                    return res.send({ status: 'OK', message: 'Quest removed!'});
                } else {
                    res.statusCode = 500;

                    return res.send({ error: 'Server error' });
                }
            });
        });
    }
};
