'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./baseApi');
const passport = require('../../libs/passport/passport-init');
const Account = require('../../models/account');

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, account, info) => {
            if (err) {
                return baseApi.getErrorCallback(res, httpStatus.BAD_REQUEST)(err);
            }

            return req.logIn(account, () => baseApi.getSuccessCallback(res, httpStatus.OK)(info));
        })(req, res, next);
    },

    signUp(req, res) {
        const statusCodes = {successCode: httpStatus.CREATED, failureCode: httpStatus.BAD_REQUEST};

        return Account
            .create({username: req.body.username, password: req.body.password})
            .then(() => () => `${req.body.username} was signed up`)
            .catch(() => () => {
                throw new Error(`${req.body.username} already exists`);
            })
            .then(callbackResult => baseApi.resolveRequestPromise(callbackResult, res, statusCodes));
    },

    logout(req, res) {
        req.logout();
        res.redirect('/');
    }
};
