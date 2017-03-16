'use strict';

module.exports = questCount => {
    const Quest = require('../models/quest');
    questCount = questCount || 1;
    const quests = [];

    for (let i = 0; i < questCount; i++) {
        let quest = new Quest({
            title: 'Заголовок ' + i,
            description: 'Описание ' + i
        });

        quests.push(quest.save());
    }

    return Promise
        .all(quests);
};
