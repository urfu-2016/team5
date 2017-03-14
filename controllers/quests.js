'use strict';
const Quest = require('../models/quest');

function checkError(res, err) {
    if (err) {
        res.send(err);
    }
}

module.exports = {
    createQuest: (req, res) => {
        const quest = new Quest({
            title: req.body.title,
            description: req.body.description
        });
        quest.save((err, quest) => {
            checkError(res, err);
            res.send({ quest });
        });
    },
    getQuests: (req, res) => {
        Quest.find((err, quests) => {
            checkError(res, err);
            res.send(quests);
        });
    },
    getQuestById: (req, res) => {
        Quest.findById(req.params.id, function (err, quest) {
            checkError(res, err);
            res.send({ quest });
        });
    },
    updateQuest: (req, res) => {
        Quest.findById(req.params.id, function (err, quest) {
            checkError(res, err);
            quest.title = req.body.title;
            quest.description = req.body.description;

            quest.save(function (err, quest) {
                checkError(res, err);
                res.send({ quest, message: 'Quest updated!' });
            });
        });
    },
    removeQuest: (req, res) => {
        Quest.findById(req.params.id, function (err, quest) {
            checkError(res, err);
            quest.remove(function (err) {
                checkError(res, err);
                res.send({ message: 'Quest removed!' });
            });
        });
    }
};
