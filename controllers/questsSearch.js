const Quest = require('../models/quest');

module.exports = {
    getFoundQuests(req, res) {
        const params = {
            searchString: req.query.searchString || '',
            searchProperty: req.query.searchRadio || 'title',
            sortProperty: req.query.sortRadio || 'dateOfCreation'
        };
        Quest.getFilteredQuests(params.searchProperty, params.sortProperty,
            params.searchString)
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
