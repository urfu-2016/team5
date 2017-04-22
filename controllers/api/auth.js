'use strict';

const httpStatus = require('http-status-codes');
const passport = require('../../libs/passport');
const User = require('../../models/user');
const constants = require('../../constants/constants');
const BadRequestError = require('../../libs/customErrors/errors').BadRequestError;

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
                .send({message: constants.controllers.auth.signedInPattern(req.body.username)})
            );
        })(req, res, next);
    },

    async signUp(req, res, next) {
        const userData = {
            username: req.body.username,
            password: req.body.password
        };

        try {
            await User.create(userData);
            res
                .status(httpStatus.CREATED)
                .send({message: constants.controllers.auth.signedUpPattern(req.body.username)});
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
                .send({message: constants.controllers.auth.authorizationRequired});
        }
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
