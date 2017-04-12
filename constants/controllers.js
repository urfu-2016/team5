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
        signedInPattern: username => `${username}, поздравляем, вы аутентифицированы!`
    }
};
