'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./baseApi');
const passport = require('../../libs/passport/passport-init');
const Account = require('../../models/account');

const constants = require('../../constants/constants').controllers.auth;

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, account) => {
            const data = {message: constants.signedInPattern(req.body.username)};
            if (err) {
                return baseApi.getErrorCallback(res, httpStatus.BAD_REQUEST)(err);
            }

            return req.logIn(account, () => baseApi.getSuccessCallback(res, httpStatus.OK)(data));
        })(req, res, next);
    },

    signUp(req, res) {
        const statusCodes = {successCode: httpStatus.CREATED, failureCode: httpStatus.BAD_REQUEST};

        return Account
            .create({username: req.body.username, password: req.body.password})
            .then(() => () => constants.signedUpPattern(req.body.username))
            .catch(() => () => {
                throw new Error(constants.alreadyExistsPattern(req.body.username));
            })
            .then(callbackResult => baseApi.resolveRequestPromise(callbackResult, res, statusCodes));
    },

    logout(req, res) {
        req.logout();
        res.redirect('/');
    }
};
