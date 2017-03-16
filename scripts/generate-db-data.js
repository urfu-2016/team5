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

        // quest
        //     .save()
            // .then(() => {
            //     return Quest
            //         .find({})
            //         .exec();
            // })
            // .then(v => {
            //     console.log(v);
            //
            //     return v;
            // })
        quests.push(
            quest.save()
        );
    }


    return Promise
        .all(quests);
};
