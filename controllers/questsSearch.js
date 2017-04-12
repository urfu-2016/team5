'use strict';

const constants = require('../constants/controllers').questSearchController;
const Quest = require('../models/quest');
const countCards = 4;

function getSearchPropsByRequest(req) {
    const searchProperties = [];
    if (req.query.searchByTitle) {
        searchProperties.push('title');
    }
    if (req.query.searchByTags) {
        searchProperties.push('tags');
    }

    return searchProperties;
}

module.exports = {
    getFoundQuests(req, res) {
        const searchProperties = getSearchPropsByRequest(req);
        const searchString = req.query.searchString || '';
        const searchPage = req.query.searchPage || 1;
        const searchPromises = [];

        if (req.query.searchByAuthor) {
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
                quests = quests || [];
                quests.sort();
                const firstCardNumber = (searchPage - 1) * countCards;
                const lastCardNumber = searchPage * countCards;
                const renderData = {
                    page: Number(searchPage),
                    maxPage: Math.ceil(quests.length / countCards),
                    title: constants.title,
                    quests: quests.slice(firstCardNumber, lastCardNumber),
                    isEmptyQuests: quests.length === 0
                };

                res.send(renderData);
            });
    }
};
