'use strict';

module.exports = {
    questSearch: {
        title: 'Список квестов',
        cardsCount: 6,
        searchFieldsCodes: {
            author: 1,
            title: 2,
            tags: 3
        }
    },

    user: {
        userNotFoundErrorMessage: 'User was not found'
    },

    quest: {
        questNotFoundErrorMessage: 'Quests was not found'
    },

    index: {
        title: 'Список квестов'
    },

    auth: {
        signedUpPattern: username => `${username} was signed up`,
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`,
        authorizationRequired: 'Необходима авторизация.',
        alreadyAuthenticated: 'Вы уже аутентифицированы.'
    }
};
