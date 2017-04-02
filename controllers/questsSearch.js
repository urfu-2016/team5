const Quest = require('../models/quest');

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
        const searchPromises = [];

        if (req.query.searchByAuthor) {
            searchPromises.push(Quest.searchByAuthor(searchString));
        }

        const questsPromise = Quest
            .searchByInternalProps(searchProperties, searchString);

        searchPromises.push(questsPromise);

        // Было жалко убирать все связанное с поиском по автору,
        // поэтому пока сделал так
        Promise.all(searchPromises)
            .then(data => {
                const quests = data.reduce((acc, quests) => {
                    quests.forEach(quest => acc.add(quest));

                    return acc;
                }, new Set());

                return Array.from(quests);
            })
            .then(quests => {
                const renderData = {
                    title: 'Список квестов',
                    quests: quests || [],
                    isEmptyQuests: quests.length === 0
                };

                res.render('questsAll/quests-all', renderData);
            });
    }
};
