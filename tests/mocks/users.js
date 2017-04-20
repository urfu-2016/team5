'use strict';

const userWithCorrectPassword = {
    username: 'user',
    password: 'password'
};

module.exports = {
    UserWithCorrectPassword: userWithCorrectPassword,

    userWithIncorrectPassword: Object.assign({}, userWithCorrectPassword, {
        password: userWithCorrectPassword.password + '0'
    }),

    userWithoutRequiredFields: {}
};
