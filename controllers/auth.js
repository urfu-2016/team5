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
            const queryHash = await QueriesStorage.updateEmailVerificationQuery(user.email);
            await emailClient.sendRegistrationMail(user.email, queryHash);

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
        if (!user) {
            return next(new errors.NotFoundError(constants.controllers.user.userNotFoundErrorMessage));
        }

        try {
            const queryHash = await QueriesStorage.updatePasswordResetQuery(email);
            await emailClient.sendPasswordResetMail(email, queryHash);
        } catch (err) {
            next(new errors.BadRequestError(err.message));
        }

        res
            .status(httpStatus.OK)
            .send(`На почту с адресом ${email} было отправлено письмо для сброса пароля`);
    },

    async resetPassword(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;

        if (await QueriesStorage.verifyPasswordResetQuery(email, queryHash)) {
            await User.resetPassword({email}, req.body.newPassword);

            res.status(httpStatus.OK).send('Пароль был изменен');
        } else {
            next(new errors.NotFoundError(constants.controllers.index.pageNotExistsMessage));
        }
    },

    async verifyUserEmail(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;

        if (await QueriesStorage.verifyEmailVerificationQuery(email, queryHash)) {
            await User.updateOne(
                {email}, {emailVerified: true}, {overwrite: true}
            );

            res.status(httpStatus.OK).send(`${email} подтвержден`);
        } else {
            next(new errors.NotFoundError(constants.controllers.index.pageNotExistsMessage));
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

    async getResetPassPage(req, res, next) {
        const email = req.params.email;
        const queryHash = req.params.queryHash;
        const checkResult = await QueriesStorage.checkPasswordResetQuery(email, queryHash);
        if (!checkResult) {
            return next(new errors.NotFoundError(constants.controllers.index.pageNotExistsMessage));
        }

        const encodedEmail = encodeURIComponent(email);
        const query = `${encodedEmail}/${queryHash}`;
        res.render('resetPass/reset-pass', {query});
    },

    logout(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }
};
