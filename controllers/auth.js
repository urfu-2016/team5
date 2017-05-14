'use strict';

const httpStatus = require('http-status-codes');
const {BadRequestError, NotFoundError} = require('../libs/customErrors/errors');
const passport = require('../libs/passport');
const User = require('../models/user');
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
            user.username = user.username.toLowerCase();

            return req.logIn(user, () => res.status(httpStatus.OK).send());
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
            req.body.login = req.body.username;

            this.signIn(req, res, next);
        } catch (err) {
            throw new BadRequestError(err.message);
        }
    },

    async resetPasswordRequest(req, res) {
        if (req.user) {
            throw new BadRequestError(constants.controllers.auth.alreadyAuthenticated);
        }

        const email = req.body.email.toLowerCase();
        const user = await User.findOne({email});
        if (!user) {
            throw new NotFoundError(constants.controllers.user.userNotFoundErrorMessage);
        }

        try {
            const queryHash = await QueriesStorage.updatePasswordResetQuery(email);
            await emailClient.sendPasswordResetMail(email, queryHash);
        } catch (err) {
            throw new BadRequestError(err.message);
        }

        const infoMessage = `На почту с адресом ${email} было отправлено письмо для сброса пароля`;
        res.status(httpStatus.OK).send(infoMessage);
    },

    async resetPassword(req, res) {
        const email = req.params.email.toLowerCase();
        const queryHash = req.params.queryHash;

        if (!req.body.newPassword) {
            throw new BadRequestError(constants.controllers.auth.passwordResetInputRequired);
        }

        if (req.user) {
            res.render('infoPage/infoPage', {infoMessage: constants.controllers.auth.alreadyAuthenticated});

            return;
        }

        if (await QueriesStorage.verifyPasswordResetQuery(email, queryHash)) {
            await User.resetPassword({email}, req.body.newPassword);

            const infoMessage = constants.controllers.auth.passwordWasChanged;
            res.status(httpStatus.OK).send(infoMessage);
        } else {
            res.render('infoPage/infoPage', {infoMessage: constants.controllers.index.pageNotExistsMessage});
            // throw new NotFoundError(constants.controllers.index.pageNotExistsMessage);
        }
    },

    async verifyUserEmail(req, res) {
        const email = req.params.email.toLowerCase();
        const queryHash = req.params.queryHash;

        if (await QueriesStorage.verifyEmailConfirmationQuery(email, queryHash)) {
            await User.updateOne(
                {email}, {emailVerified: true}
            );

            res.render('infoPage/infoPage', {infoMessage: `${email} подтвержден`});
        } else {
            res.render('infoPage/infoPage', {infoMessage: constants.controllers.index.pageNotExistsMessage});
        }
    },

    authorizedOnly(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.render('infoPage/infoPage', {infoMessage: constants.controllers.auth.authorizationRequired});
            // throw new BadRequestError(constants.controllers.auth.authorizationRequired);
        }
    },

    async getResetPassPage(req, res) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;
        const checkResult = await QueriesStorage.checkPasswordResetQuery(email, queryHash);
        if (!checkResult) {
            res.render(
                'infoPage/infoPage',
                {
                    infoMessage: constants.controllers.index.pageNotExistsMessage,
                    isAuth: req.user
                }
            );

            return;
            // throw new NotFoundError(constants.controllers.index.pageNotExistsMessage);
        }

        const encodedEmail = encodeURIComponent(email);
        res.render('resetPass/reset-pass', {email: encodedEmail, queryHash, isAuth: req.user});
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
