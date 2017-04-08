'use strict';

module.exports = {
    questSearch: {
        title: 'Список квестов'
    },

    index: {
        title: 'Список квестов'
    },

    auth: {
        signedUpPattern: username => `${username} was signed up`,
        alreadyExistsPattern: username => `${username} already exists`,
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`
    }
};
