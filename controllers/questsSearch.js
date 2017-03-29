const Quest = require('../models/quest');

module.exports = {
    getFoundQuests(req, res) {
        const searchProperties = [];
        const searchString = req.query.searchString || '';
        // Пока не знаю как красивее
        if (req.query.searchByTitle) {
            searchProperties.push('title');
        }
        if (req.query.searchByTags) {
            searchProperties.push('tags');
        }

        console.log(searchProperties);

        Quest.getFilteredQuests(searchProperties, searchString)
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
