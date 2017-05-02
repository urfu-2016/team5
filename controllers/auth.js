'use strict';

const httpStatus = require('http-status-codes');
const BadRequestError = require('../libs/customErrors/errors').BadRequestError;
const passport = require('../libs/passport');
const User = require('../models/user');
const emailClient = require('./email-client');
const constants = require('../constants/constants');

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, user) => {
            if (!user) {
                return next(new BadRequestError(constants.models.user.wrongPasswordOrNameMessage));
            }

            if (req.user) {
                return next(new BadRequestError(constants.controllers.auth.alreadyAuthenticated));
            }

            if (err) {
                return next(new BadRequestError(err.message));
            }

            return req.logIn(user, () => res
                .status(httpStatus.OK)
                .send({message: constants.controllers.auth.signedInPattern(user.username)})
            );
        })(req, res, next);
    },

    async signUp(req, res, next) {
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        try {
            const user = await User.create(userData);
            emailClient.sendRegistrationMail(user.email);

            res
                .status(httpStatus.CREATED)
                .send(constants.controllers.auth.signedUpPattern(req.body.username));
        } catch (err) {
            next(new BadRequestError(err.message));
        }
    },

    authorizedOnly(req, res, next) {
        if (req.user) {
            next();
        } else {
            res
                .status(httpStatus.BAD_REQUEST)
                .send(constants.controllers.auth.authorizationRequired);
        }
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
