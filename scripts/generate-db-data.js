'use strict';

const Quest = require('../models/quest');
const slug = 'Novyj-kvest';
const titlePrefix = 'Заголовок ';
const descriptionPrefix = 'Описание ';
const tags = ['Екатеринбург', 'Памятники'];

module.exports = questCount => {
    questCount = questCount || 1;
    const quests = [];

    for (let i = 0; i < questCount; i++) {
        let data = {
            title: `${titlePrefix} ${i}`,
            description: `${descriptionPrefix} ${i}`,
            slug: `${slug} ${i}`,
            tags
        };

        quests.push(Quest.create(data));
    }

    return Promise
        .all(quests);
};
