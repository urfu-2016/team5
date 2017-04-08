'use strict';

const accWithCorrectPass = {username: 'a', password: 'b'};
const accWithIncorrectPassword = {
    username: accWithCorrectPass.username,
    password: accWithCorrectPass.password + '0'
};

module.exports = {
    accWithCorrectPassword: accWithCorrectPass,
    accWithIncorrectPassword: accWithIncorrectPassword
};
