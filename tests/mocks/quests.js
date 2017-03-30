'use strict';
const User = require('../../models/user');
console.log(User);

module.exports = {
    regularQuest: {
        title: 'Заголовок',
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити']
    },

<<<<<<< HEAD
    questWithoutRequiredFields: {},

    questForSeatch: {
        title: 'Описание',
        description: 'Описание',
        tags: ['Заголовок']
=======
    oneMoreQuest: {
        title: 'Заголовок',
        description: 'Описание',
        slug: 'some-slug-2'
    },

    questWithoutSlug: {
        title: 'Заголовок',
        description: 'Описание'
>>>>>>> Сделал ребейз + мелкие правки
    },

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
