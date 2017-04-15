'use strict';

const constants = require('../constants/controllers').questSearch;
const Quest = require('../models/quest');

function getSearchPropsByRequest(searchByField) {
    const searchProperties = [];

    if (searchByField === constants.searchFieldsCodes.title) {
        searchProperties.push('title');
    }

    if (searchByField === constants.searchFieldsCodes.tags) {
        searchProperties.push('tags');
    }

    return searchProperties;
}

module.exports = {
    getFoundQuests(req, res) {
        const searchByField = Number(req.query.searchByField);
        const searchProperties = getSearchPropsByRequest(searchByField);
        const searchString = req.query.searchString || '';
        const searchPromises = [];
        var searchPageNumber = 1;

        if (req.query.searchPageNumber) {
            searchPageNumber = Number(req.query.searchPageNumber);
            searchPageNumber = searchPageNumber < 0 ? 1 : searchPageNumber;
        }

        if (req.query.searchByField === constants.searchFieldsCodes.author) {
            searchPromises.push(Quest.searchByAuthor(searchString));
        }

        const questsPromise = Quest
            .searchByInternalProps(searchProperties, searchString);

        searchPromises.push(questsPromise);

        // FIXME: Было жалко убирать все связанное с поиском по автору,
        // FIXME: поэтому пока сделал так
        Promise.all(searchPromises)
            .then(data => {
                const quests = data.reduce((acc, quests) => {
                    quests.forEach(quest => acc.add(quest));

                    return acc;
                }, new Set());

                return Array.from(quests)
                    .sort((a, b) => {
                        return new Date(b.dateOfCreation) - new Date(a.dateOfCreation);
                    });
            })
            .then(quests => {
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
