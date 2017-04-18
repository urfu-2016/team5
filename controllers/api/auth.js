'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./baseApi');
const passport = require('../../libs/passport');
const User = require('../../models/user');

const constants = require('../../constants/constants').controllers.auth;

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, user) => {
            if (!user) {
                res.send('Неверное имя пользователя или пароль.');
                return;
            } else if (req.user) {
                res.send('Вы уже аутентифицированы');
                return;
            }

            const data = {message: constants.signedInPattern(req.body.username)};
            if (err) {
                return baseApi.getErrorCallback(res, httpStatus.BAD_REQUEST)(err);
            }

            req.session.user = user._id;

            return req.logIn(user, () => baseApi.getSuccessCallback(res, httpStatus.OK)(data));
        })(req, res, next);
    },

    async signUp(req, res) {
        const statusCodes = {
            successCode: httpStatus.CREATED,
            failureCode: httpStatus.BAD_REQUEST
        };

        const userData = {
            username: req.body.username,
            password: req.body.password
        };

        let callbackResult;
        try {
            await User.create(userData);

            callbackResult = () => constants.signedUpPattern(req.body.username);
        } catch (err) {
            callbackResult = () => {
                throw err;
            };
        }

        return await baseApi.resolveRequestPromise(callbackResult, res, statusCodes);
    },

    changePassword(req, res) {
        const user = {
            username: req.body.username,
            password: req.body.password
        };

        const newPassword = req.body.newpassword;
        if (req.session.user) {
            console.log(req.session.user);
        }

        return User
            .changePassword(user, newPassword)
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
