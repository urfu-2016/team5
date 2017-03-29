'use strict';

const HttpStatus = require('http-status-codes');
const User = require('../../models/user');
const baseApi = require('./baseApi');

module.exports = {
    getUsers(req, res) {
        return User.getAll()
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    },

    getUserByUsername(req, res) {
        return User.getByUsername(req.params.username)
            .then(baseApi.getSuccessCallback(res, HttpStatus.OK))
            .catch(baseApi.getErrorCallback(res));
    }
};
