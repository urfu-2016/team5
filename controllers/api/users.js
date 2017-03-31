'use strict';

const User = require('../../models/user');
const baseApi = require('./baseApi');

module.exports = {
    getUsers: (req, res) => baseApi.resolveRequestPromise(User.getAll(), res),

    getUserByUsername: (req, res) => baseApi.resolveRequestPromise(User.getByUsername(req.params.username), res)
};
