'use strict';
require('../../models/user');

module.exports = {
    regularQuest: {
        title: 'Заголовок',
        description: 'Описание',
        tags: ['Екатеринбург', 'Граффити']
    },

    questWithoutRequiredFields: {},

    questForSearch: {
        title: 'Описание',
        description: 'Описание',
        tags: ['Заголовок'],
        city: 'Екатеринбург'
    },

    oneMoreQuest: {
        title: 'Заголовок',
        description: 'Описание',
        slug: 'some-slug-2'
    },

    questWithoutSlug: {
        title: 'Заголовок',
        description: 'Описание'
    },

    requestBody: {
        search: {
            field: 'title',
            text: ''
        },
        likesCount: 0,
        images: {
            from: 0,
            to: 10
        }
    }
};
