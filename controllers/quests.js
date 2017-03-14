'use strict';
const Quest = require('../models/quest');

module.exports = {
    createQuest: (req, res) => {
        const quest = new Quest({
            title: req.body.title,
            description: req.body.description
        });
        quest.save((err, quest) => {
            if (err) {
                return res.send(err);
            }
            res.send({ quest });
        });
    },
    getQuests: (req, res) => {
        Quest.find((err, quests) => {
            if (err) {
                return res.send(err);
            }
            res.send(quests);
        });
    },
    getQuestById: (req, res) => {
        Quest.findById(req.params.id, (err, quest) => {
            if (err) {
                return res.send(err);
            }
            res.send({ quest });
        });
    },
    updateQuest: (req, res) => {
        Quest.findById(req.params.id, (err, quest) => {
            if (err) {
                return res.send(err);
            }
            quest.title = req.body.title;
            quest.description = req.body.description;

            quest.save((err, quest) => {
                if (err) {
                    return res.send(err);
                }
                res.send({ quest, message: 'Quest updated!' });
            });
        });
    },
    removeQuest: (req, res) => {
        Quest.findById(req.params.id, (err, quest) => {
            if (err) {
                return res.send(err);
            }
            quest.remove((err) => {
                if (err) {
                    return res.send(err);
                }
                res.send({ message: 'Quest removed!' });
            });
        });
    }
};
