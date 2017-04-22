'use strict';

const User = require('../../models/user');
const constants = require('../../constants/controllers').user;
const httpStatus = require('http-status-codes');
const errors = require('../../libs/customErrors/errors');

module.exports = {
    async getUsers(req, res, next) {
        const users = await User.getAll();
        if (users.length === 0) {
            return next(new errors.NotFoundError(constants.userNotFoundErrorMessage));
        }

        res.status(httpStatus.OK).send({data: users});
    },

    async getUserByUsername(req, res, next) {
        const user = await User.getByUsername(req.params.username);
        if (user === null) {
            return next(new errors.NotFoundError(constants.userNotFoundErrorMessage));
        }

        res.status(httpStatus.OK).send({data: user});
    }
};
