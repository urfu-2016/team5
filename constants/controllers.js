'use strict';

module.exports = {
    questSearch: {
        title: 'Список квестов',
        cardsCount: 6,
        searchBy: {
            Author: 1,
            Title: 2,
            Tags: 3
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
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`
    }
};
