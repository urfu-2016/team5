'use strict';

const constants = require('../constants/controllers').questSearch;
const Quest = require('../models/quest');

function getSearchPropsByRequest(searchByField) {
    const searchProperties = [];

    if (searchByField === constants.searchBy.Title) {
        searchProperties.push('title');
    }

    if (searchByField === constants.searchBy.Tags) {
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
        var searchPage = 1;

        if (req.query.searchPage) {
            searchPage = Number(req.query.searchPage);
            searchPage = searchPage < 0 ? 1 : searchPage;
        }

        if (req.query.searchByField === constants.searchBy.Author) {
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
                const firstCardNumber = (searchPage - 1) * constants.cardsCount;
                const lastCardNumber = firstCardNumber + constants.cardsCount;
                const renderData = {
                    pageNumber: searchPage,
                    maxPageNumber: Math.ceil(quests.length / constants.cardsCount),
                    title: constants.title,
                    quests: quests.slice(firstCardNumber, lastCardNumber),
                    isEmptyQuests: quests.length === 0
                };

                res.send(renderData);
            });
    }
};
