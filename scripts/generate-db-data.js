'use strict';

module.exports = questCount => {
    const Quest = require('../models/quest');
    questCount = questCount || 1;
    const slug = 'Novyj-kvest';
    const titlePrefix = 'Заголовок ';
    const descriptionPrefix = 'Описание ';
    const quests = [];

    for (let i = 0; i < questCount; i++) {
        let quest = new Quest({
            title: `${titlePrefix} ${i}`,
            description: `${descriptionPrefix} ${i}`,
            slug: `${slug} ${i}`
        });

        quests.push(quest.save());
    }

    return Promise
        .all(quests);
};
