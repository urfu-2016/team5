'use strict';

const userWithCorrectPassword = {
    username: 'user',
    email: 'somemail@mail.ru',
    password: 'password'
};

module.exports = {
    userWithCorrectPassword: userWithCorrectPassword,

    userWithIncorrectPassword: Object.assign({}, userWithCorrectPassword, {
        password: userWithCorrectPassword.password + '0'
    }),

    userWithoutRequiredFields: {}
};
