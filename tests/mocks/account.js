'use strict';

const accWithCorrectPassword = {username: 'a', password: 'b'};

module.exports = {
    accWithCorrectPassword: accWithCorrectPassword,
    accWithIncorrectPassword: {
        username: accWithCorrectPassword.username,
        password: accWithCorrectPassword.password + '0'
    }
};

// test
