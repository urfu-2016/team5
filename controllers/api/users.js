'use strict';

const User = require('../../models/user');
const baseApi = require('./baseApi');
const constants = require('../../constants/controllers').user;

module.exports = {
    getUsers(req, res) {
        return User
            .getAll()
            .then(users => {
                return users && users.length === 0 ? () => {
                    throw new Error(constants.userNotFoundErrorMessage);
                } : () => users;
            })
            .then(resultCallback => baseApi.resolveRequestPromise(resultCallback, res));
    },

    getUserByUsername(req, res) {
        return User
            .getByUsername(req.params.username)
            .then(user => {
                return user === null ? () => {
                    throw new Error(constants.userNotFoundErrorMessage);
                } : () => user;
            })
            .then(resultCallback => baseApi.resolveRequestPromise(resultCallback, res));
    }
};
