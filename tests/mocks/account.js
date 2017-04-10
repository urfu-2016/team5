'use strict';

module.exports = {
    accWithCorrectPassword: {username: 'a', password: 'b'},
    accWithIncorrectPassword: {
        username: module.exports.accWithCorrectPassword,
        password: module.exports.accWithCorrectPassword + '0'
    }
};
