'use strict';

const httpStatus = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../libs/customErrors/errors');
const passport = require('../libs/passport');
const User = require('../models/user');
const config = require('config');
const emailClient = require('../libs/email-client');
const constants = require('../constants/constants');
const QueriesStorage = require('../models/queriesStorage');

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

            const referer = req.headers.referer;
            const redirectLink = referer !== undefined && referer.startsWith(config.appUrl) ? referer : '/';

            return req.logIn(user, () => res.redirect(redirectLink));
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
            const queryHash = await QueriesStorage.updateEmailConfirmationQuery(user.email);
            await emailClient.sendRegistrationMail(user.email, queryHash);
            const signedUpMessage = constants.controllers.auth.signedUpPattern(req.body.username);

            res.status(httpStatus.CREATED).send(signedUpMessage);
        } catch (err) {
            next(new BadRequestError(err.message));
        }
    },

    async resetPasswordRequest(req, res, next) {
        if (req.user) {
            return next(new BadRequestError(constants.controllers.auth.alreadyAuthenticated));
        }

        const email = req.body.email;
        const user = await User.findOne({email});
        if (!user) {
            const userNotFoundMessage = constants.controllers.user.userNotFoundErrorMessage;

            return next(new NotFoundError(userNotFoundMessage));
        }

        try {
            const queryHash = await QueriesStorage.updatePasswordResetQuery(email);
            await emailClient.sendPasswordResetMail(email, queryHash);
        } catch (err) {
            next(new BadRequestError(err.message));
        }

        const emailSendMessage = `На почту с адресом ${email} было отправлено письмо для сброса пароля`;
        res.status(httpStatus.OK).send(emailSendMessage);
    },

    async resetPassword(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;

        if (!req.body.newPassword) {
            return next(new BadRequestError(constants.controllers.auth.passwordResetInputRequired));
        }

        if (await QueriesStorage.verifyPasswordResetQuery(email, queryHash)) {
            await User.resetPassword({email}, req.body.newPassword);

            res.status(httpStatus.OK).send(constants.controllers.auth.passwordWasChanged);
        } else {
            next(new NotFoundError(constants.controllers.index.pageNotExistsMessage));
        }
    },

    async verifyUserEmail(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;

        if (await QueriesStorage.verifyEmailConfirmationQuery(email, queryHash)) {
            await User.updateOne(
                {email}, {emailVerified: true}
            );

            res.status(httpStatus.OK).send(`${email} подтвержден`);
        } else {
            next(new NotFoundError(constants.controllers.index.pageNotExistsMessage));
        }
    },

    authorizedOnly(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.status(httpStatus.BAD_REQUEST).send(constants.controllers.auth.authorizationRequired);
        }
    },

    async getResetPassPage(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;
        const checkResult = await QueriesStorage.checkPasswordResetQuery(email, queryHash);
        if (!checkResult) {
            return next(new NotFoundError(constants.controllers.index.pageNotExistsMessage));
        }

        const encodedEmail = encodeURIComponent(email);
        res.render('resetPass/reset-pass', {email: encodedEmail, queryHash});
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
