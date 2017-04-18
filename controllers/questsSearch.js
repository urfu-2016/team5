'use strict';

const constants = require('../constants/controllers').questSearch;
const Quest = require('../models/quest');
const queryBuilder = require('../libs/queryBuilder');

module.exports = {
    findQuests(req, res) {
        return queryBuilder.build(req.body)
            .then(buildData => Quest.search(buildData))
            .then(quests => {
                // FIXME заглушка для страниц
                const searchPageNumber = 1;
                const firstCardNumber = (searchPageNumber - 1) * constants.cardsCount;
                const lastCardNumber = firstCardNumber + constants.cardsCount;
                const renderData = {
                    pageNumber: searchPageNumber,
                    maxPageNumber: Math.ceil(quests.length / constants.cardsCount),
                    title: constants.title,
                    quests: quests.slice(firstCardNumber, lastCardNumber),
                    isEmptyQuests: quests.length === 0
                };

                res.send(renderData);
            });
    }
};
