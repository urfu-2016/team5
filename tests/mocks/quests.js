'use strict';
const User = require('../../models/user');
console.log(User);

module.exports = {
    regularQuest: {
        title: 'Заголовок',
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити']
    },

    questWithoutRequiredFields: {},

    setAuthorAfterCreateUser(data) {
        const username = 'username' + Date.now();

        return new Promise(resolve => {
            User.create({username})
            .then(user => {
                data.author = user;
                resolve();
            });
        });
    }
};
