'use strict';
const User = require('../../models/user');
console.log(User);

module.exports = {
    regularQuest: {
        title: 'Заголовок',
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити']
    },

    questWithoutRequiredFields: {}
};
