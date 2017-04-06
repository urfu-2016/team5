'use strict';

const User = require('../../models/user');
const baseApi = require('./baseApi');

module.exports = {
    getUsers(req, res) {
        return User
            .getAll()
            .then(users => {
                return users && users.length === 0 ? () => {
                    throw new Error('Users wasn\'t found');
                } : () => users;
            })
            .then(resultCallback => baseApi.resolveRequestPromise(resultCallback, res));
    },

    getUserByUsername(req, res) {
        return User
            .getByUsername(req.params.username)
            .then(user => {
                return user === null ? () => {
                    throw new Error('User wasn\'t found');
                } : () => user;
            })
            .then(resultCallback => baseApi.resolveRequestPromise(resultCallback, res));
    }
};
