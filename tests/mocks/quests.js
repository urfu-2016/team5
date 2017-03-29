'use strict';
const User = require('../../models/user');

module.exports = {
    regularQuest: {
        title: 'Заголовок',
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити'],
        author: new User({'nickname'}),
        likes: [author]
    },

    questWithoutTitle: {
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити'],
        author: new User({'nickname'}),
        likes: [author]
    },

    questWithoutRequiredFields: {}
};
