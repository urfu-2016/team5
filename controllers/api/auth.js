'use strict';

const httpStatus = require('http-status-codes');
const baseApi = require('./baseApi');
const passport = require('../../libs/passport');
const User = require('../../models/user');
const constants = require('../../constants/constants');

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, user) => {
            if (!user) {
                res.send(constants.models.User.wrongPasswordOrNameMessage);
                return;
            }

            if (req.user) {
                res.send(constants.controllers.auth.alreadyAuthenticated);
                return;
            }

            const data = {message: constants.controllers.auth.signedInPattern(req.body.username)};
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
            callbackResult = () => constants.controllers.auth.signedUpPattern(req.body.username);
        } catch (err) {
            callbackResult = () => {
                throw err;
            };
        }

        return await baseApi.resolveRequestPromise(callbackResult, res, statusCodes);
    },

    authorizedOnly(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(httpStatus.BAD_REQUEST).send(constants.controllers.auth.authorizationRequired);
        }
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
