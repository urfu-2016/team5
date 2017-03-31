const Quest = require('../models/quest');

module.exports = {
    getFoundQuests(req, res) {
        const searchProperties = [];
        const searchString = req.query.searchString || '';
        const searchPromises = [];
        // Пока не знаю как красивее
        if (req.query.searchByTitle) {
            searchProperties.push('title');
        }
        if (req.query.searchByTags) {
            searchProperties.push('tags');
        }
        if (req.query.searchByAuthor) {
            searchPromises.push(Quest.searchByAuthor(searchString));
        }

        const quest = Quest.searchByInternalProps(searchProperties, searchString);

        searchPromises.push(quest);

        // Было жалко убирать все связанное с поиском по автору,
        // поэтому пока сделал так
        const usedQuestSlugs = [];
        Promise.all(searchPromises)
            .then(data => {
                return data.reduce((acc, quests) => {
                    acc = acc.concat(quests);

                    return acc;
                }, []);
            })
            .then(quests => {
                return quests.filter(quest => {
                    if (quest.slug in usedQuestSlugs) {
                        return false;
                    }
                    usedQuestSlugs.push(quest.slug);

                    return  true;
                });
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
