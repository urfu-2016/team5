'use strict';

const httpStatus = require('http-status-codes');
const errors = require('../libs/customErrors/errors');
const passport = require('../libs/passport');
const User = require('../models/user');
const emailClient = require('../libs/email-client');
const constants = require('../constants/constants');
const QueriesStorage = require('../models/queriesStorage');

module.exports = {
    signIn(req, res, next) {
        passport.authenticate('local', (err, user) => {
            if (!user) {
                return next(new errors.BadRequestError(constants.models.user.wrongPasswordOrNameMessage));
            }

            if (req.user) {
                return next(new errors.BadRequestError(constants.controllers.auth.alreadyAuthenticated));
            }

            if (err) {
                return next(new errors.BadRequestError(err.message));
            }

            return req.logIn(user, () => res.redirect(req.headers.referer || '/'));
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
            next(new errors.BadRequestError(err.message));
        }
    },

    async resetPasswordRequest(req, res, next) {
        const email = req.body.email;
        const user = await User.findOne({email});
        if (user) {
            emailClient.sendPasswordResetMail(email);
            res
                .status(httpStatus.OK)
                .send(`На почту с адресом ${email} было отправлено письмо для сброса пароля`);
        } else {
            next(new errors.NotFoundError(constants.controllers.user.userNotFoundErrorMessage));
        }
    },

    async resetPassword(req, res, next) {
        handleMailLinkRequest(req, 'passwordReset', next, async email => {
            await User.resetPassword({email}, req.body.newPassword);
            res.status(httpStatus.OK).send('Пароль был изменен');
        });
    },

    async verifyUserEmail(req, res, next) {
        handleMailLinkRequest(req, 'emailVerification', next, async email => {
            const user = await User.findOne({email});
            user.emailVerified = true;
            await user.save();
            res.status(httpStatus.OK).send(`${req.email} подтвержден`);
        });
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

async function handleMailLinkRequest(req, requestType, next, onSuccessCallback) {
    const query = req.params.query;
    const email = query.split(constants.models.query.delimiter)[0];

    if (await QueriesStorage.verifyQuery(query, requestType)) {
        onSuccessCallback(email);
    } else {
        next(new errors.NotFoundError(constants.controllers.index.pageNotExistsMessage));
    }
}
