'use strict';

module.exports = {
    questSearch: {
        title: 'Список квестов',
        cardsCount: 6
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
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`
    }
};
