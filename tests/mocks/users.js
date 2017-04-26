'use strict';

const username = 'user';
const userWithCorrectPassword = {
    username: username,
    email: 'somemail@mail.ru',
    password: 'password',
    login: username
};

module.exports = {
    userWithCorrectPassword: userWithCorrectPassword,

    userWithIncorrectPassword: Object.assign({}, userWithCorrectPassword, {
        password: userWithCorrectPassword.password + '0'
    }),

    userWithoutRequiredFields: {}
};
