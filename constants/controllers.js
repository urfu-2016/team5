'use strict';

module.exports = {
    questSearch: {
        title: 'Список квестов',
        cardsCount: 6,
        searchFieldsCodes: {
            author: 1,
            title: 2,
            tags: 3,
            city: 4,
            description: 5
        },
        searchFields: ['author', 'title', 'tags', 'city', 'description', 'images', 'likesCount'],
        internalProperties: ['city', 'title', 'description', 'tags']
    },

    user: {
        userNotFoundErrorMessage: 'Такого пользователя не существует'
    },

    quest: {
        questNotFoundErrorMessage: 'Такого квеста не существует'
    },

    index: {
        title: 'Список квестов'
    },

    auth: {
        signedUpPattern: username => `${username} был зарегистрирован`,
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`,
        authorizationRequired: 'Необходима авторизация.',
        alreadyAuthenticated: 'Вы уже аутентифицированы.'
    },

    dateFormat: 'L'
};
