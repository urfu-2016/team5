'use strict';

const Quest = require('../models/quest');
const User = require('../models/user');
const slug = 'Novyj-kvest';
const titlePrefix = 'Заголовок ';
const descriptionPrefix = 'Описание ';
const tags = ['Екатеринбург', 'Памятники'];
const username = 'nick';

module.exports = questCount => {
    questCount = questCount || 1;
    const quests = [];

    return User.create({username: username + Date.now()})
        .then(user => {
            for (let i = 0; i < questCount; i++) {
                let data = {
                    title: `${titlePrefix} ${i}`,
                    description: `${descriptionPrefix} ${i}`,
                    slug: `${slug} ${i}`,
                    tags,
                    author: user
                };

                quests.push(Quest.create(data));
            }

            return Promise
                .all(quests);
        });
};
