'use strict';

const User = require('../models/user');
const constants = require('../constants/controllers').user;
const httpStatus = require('http-status-codes');
const errors = require('../libs/customErrors/errors');

module.exports = {
    async getUsers(req, res) {
        const users = await User.getAll();
        res.status(httpStatus.OK).send({data: users});
    },

    async getUserByUsername(req, res) {
        const user = await User.getByUsername(req.params.username.toLowerCase());
        if (user === null) {
            throw new errors.NotFoundError(constants.userNotFoundErrorMessage);
        }

        res.status(httpStatus.OK).send({data: user});
    }
};
