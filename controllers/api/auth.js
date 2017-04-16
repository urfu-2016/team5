'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./baseApi');
const passport = require('../../libs/passport');
const Account = require('../../models/account');

const constants = require('../../constants/constants').controllers.auth;

const authorizedUsers = new Set();

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, account) => {
            // TODO: проверка, что пользователь уже авторизован

            if (req.session.user) {
                res.send('Вы уже аутентифицированы');
            }

            const data = {message: constants.signedInPattern(req.body.username)};
            if (err) {
                return baseApi.getErrorCallback(res, httpStatus.BAD_REQUEST)(err);
            }

            req.session.user = account._id;
            authorizedUsers.add(account._id);

            return req.logIn(account, () => baseApi.getSuccessCallback(res, httpStatus.OK)(data));
        })(req, res, next);
    },

    signUp(req, res) {
        const statusCodes = {
            successCode: httpStatus.CREATED,
            failureCode: httpStatus.BAD_REQUEST
        };

        const account = {
            username: req.body.username,
            password: req.body.password
        };

        return Account
            .create(account)
            .then(() => () => constants.signedUpPattern(req.body.username))
            .catch(err => () => {
                throw err;
            })
            .then(callbackResult => baseApi.resolveRequestPromise(callbackResult, res, statusCodes));
    },

    changePassword(req, res) {
        const account = {
            username: req.body.username,
            password: req.body.password
        };

        const newPassword = req.body.newpassword;
        if (req.session.user) {
            console.log(req.session.user);
        }

        return Account
            .changePassword(account, newPassword)
            .then(() => () => 'Ваш пароль был изменен')
            .catch(err => () => {
                throw err;
            })
            .then(callbackResult => baseApi.resolveRequestPromise(callbackResult, res));
    },

    authorizedOnly(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.send('Необходима авторизация.');
        }
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
