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

    questWithImages: {
        title: 'Заголовок',
        description: 'Описание',
        images: [
            {
                src: 'blah',
                title: 'blah',
                description: 'blah',
                location: {
                    lat: '1',
                    lon: '1'
                }
            },
            {
                src: 'second blah',
                title: 'one more blah',
                description: 'blah',
                location: {
                    lat: '1',
                    lon: '1'
                }
            }
        ]
    },

    requestBody: {
        search: {
            field: 'title',
            text: ''
        },
        likesCount: 0,
        stages: {
            from: 0,
            to: 10
        }
    }
};
