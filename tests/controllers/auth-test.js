/* eslint-env mocha */

const server = require('../../app');
const httpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const constants = require('../../constants/constants');
const QueriesStorage = require('../../models/queriesStorage');
const mocks = require('../mocks/users');
const sinon = require('sinon');

const mock = sinon.mock(require('../../libs/email-client'));
mock.expects('sendPasswordResetMail').atLeast(1);
mock.expects('sendRegistrationMail').atLeast(1);

describe('controller:auth', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('signup', () => {
        it('should sign up new user', async () => {
            const res = await chaiRequest.post('/signup', mocks.userWithCorrectPassword);

            res.status.should.be.equal(httpStatus.OK);
        });

        it('should create email confirmation query on success sign up', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            const query = await QueriesStorage.findOne({email: mocks.userWithCorrectPassword.email});

            (query !== null).should.equal(true);
        });

        it('should not create email confirmation query on failed sign up', async () => {
            try {
                await chaiRequest.post('/signup', {password: 'pass'});
            } catch (err) {
                const queries = await QueriesStorage.find({});

                queries.length.should.equal(0);
            }
        });

        it('should fail sign up for already used username', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            try {
                await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            } catch (err) {
                const username = mocks.userWithCorrectPassword.username;

                err.status.should.be.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.be.equal(constants.models.user.alreadyExistsPattern(username));
            }
        });

        it('should fail sign up without username', async () => {
            const userWithoutUsername = {email: '123aasdasd@mail.ru', password: '1'};

            try {
                await chaiRequest.post('/signup', userWithoutUsername);
            } catch (err) {
                err.response.text.should.equal(constants.models.user.emptySignUpField);
            }
        });

        it('should fail sign up without email', async () => {
            const userWithoutEmail = {username: '1', password: '1'};

            try {
                await chaiRequest.post('/signup', userWithoutEmail);
            } catch (err) {
                err.response.text.should.equal(constants.models.user.incorrectEmail);
            }
        });

        it('should sign in after sign up', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);

            const res = await chaiRequest.post('/logout');
            res.status.should.equal(httpStatus.OK);
        });
    });

    describe('signin', () => {
        it('should sign in by username with correct password', async () => {
            const userData = mocks.userWithCorrectPassword;
            await chaiRequest.post('/signup', userData);
            await chaiRequest.post('/logout');
            const res = await chaiRequest.post('/signin', {
                login: userData.username,
                password: userData.password
            });

            res.status.should.equal(httpStatus.OK);
        });

        it('should sign in by email with correct password', async () => {
            const userData = mocks.userWithCorrectPassword;
            await chaiRequest.post('/signup', userData);
            await chaiRequest.post('/logout');
            const res = await chaiRequest.post('/signin', {
                login: userData.email,
                password: userData.password
            });

            res.status.should.equal(httpStatus.OK);
        });

        it('should fails sign in with wrong password', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            try {
                await chaiRequest.post('/signin', mocks.userWithIncorrectPassword);
            } catch (err) {
                err.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.models.user.wrongPasswordOrNameMessage);
            }
        });

        it('should fails sign in if already signed in', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');
            await chaiRequest.post('/signin', mocks.userWithCorrectPassword);
            try {
                await chaiRequest.post('/signin', mocks.userWithCorrectPassword);
            } catch (err) {
                err.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.controllers.auth.alreadyAuthenticated);
            }
        });

        it('should fails sign in to non-existent account', async () => {
            try {
                await chaiRequest.post('/signin', mocks.userWithCorrectPassword);
            } catch (err) {
                err.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.models.user.wrongPasswordOrNameMessage);
            }
        });
    });

    describe('password reset request', () => {
        const email = mocks.userWithCorrectPassword.email;

        it('should success on reset password request', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');
            const emailSendMessage = `На почту с адресом ${email} было отправлено письмо для сброса пароля`;
            const res = await chaiRequest.post('/password-reset', {email});

            res.status.should.equal(httpStatus.OK);
            res.text.should.equal(emailSendMessage);
        });

        it('should fails on reset password request if user not exists', async () => {
            const userNotFoundMessage = constants.controllers.user.userNotFoundErrorMessage;
            try {
                await chaiRequest.post('/password-reset', {email});
            } catch (err) {
                err.response.status.should.equal(httpStatus.NOT_FOUND);
                err.response.text.should.equal(userNotFoundMessage);
            }
        });

        it('should fails on reset password request if user signed in', async () => {
            await chaiRequest.createUserAndSignIn(mocks.userWithCorrectPassword);
            const message = constants.controllers.auth.alreadyAuthenticated;
            try {
                await chaiRequest.post('/password-reset', {email});
            } catch (err) {
                err.response.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(message);
            }
        });
    });

    describe('password reset', () => {
        it('reset password by correct query', async () => {
            const email = mocks.userWithCorrectPassword.email;

            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');
            const hash = await QueriesStorage.updatePasswordResetQuery(email);
            const linkToPasswordReset = `/password-reset/${email}/${hash}`;
            const newPassword = 'new password';
            const res = await chaiRequest.post(linkToPasswordReset, {newPassword});

            res.status.should.equal(httpStatus.OK);
        });

        it('should not reset password by incorrect query', async () => {
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');

            const email = mocks.userWithCorrectPassword.email;
            const hash = '1' + await QueriesStorage.updatePasswordResetQuery(email);
            const linkToPasswordReset = `/password-reset/${email}/${hash}`;
            const newPassword = 'new password';

            try {
                await chaiRequest.post(linkToPasswordReset, {newPassword});
            } catch (err) {
                err.response.status.should.equal(httpStatus.NOT_FOUND);
            }
        });

        it('should not reset password if user not exists', async () => {
            const email = mocks.userWithCorrectPassword.email;
            const hash = '1';
            const linkToPasswordReset = `/password-reset/${email}/${hash}`;
            const newPassword = 'new password';

            try {
                await chaiRequest.post(linkToPasswordReset, {newPassword});
            } catch (err) {
                err.response.status.should.equal(httpStatus.NOT_FOUND);
            }
        });

        it('should not reset password if it is empty', async () => {
            const email = mocks.userWithCorrectPassword.email;

            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');
            const hash = await QueriesStorage.updatePasswordResetQuery(email);
            const linkToPasswordReset = `/password-reset/${email}/${hash}`;
            const newPassword = '';

            try {
                await chaiRequest.post(linkToPasswordReset, {newPassword});
            } catch (err) {
                err.response.status.should.equal(httpStatus.BAD_REQUEST);
            }
        });

        it('should not reset password on old link after refresh', async () => {
            const email = mocks.userWithCorrectPassword.email;
            await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            await chaiRequest.post('/logout');
            const newPassword = '123';
            const hash1 = await QueriesStorage.updatePasswordResetQuery(email);
            const linkToPasswordReset1 = `/password-reset/${email}/${hash1}`;

            const hash2 = await QueriesStorage.updatePasswordResetQuery(email);
            const linkToPasswordReset2 = `/password-reset/${email}/${hash2}`;

            try {
                await chaiRequest.post(linkToPasswordReset1, {newPassword});
            } catch (err) {
                err.response.status.should.equal(httpStatus.NOT_FOUND);
            }

            const res = await chaiRequest.post(linkToPasswordReset2, {newPassword});
            res.status.should.equal(httpStatus.OK);
        });
    });

    describe('logout', () => {
        beforeEach(() => chaiRequest.post('/signup').send(mocks.userWithCorrectPassword));

        it('should end session after logout', async () => {
            const res = await chaiRequest.post('/logout');

            Object.hasOwnProperty.call(res.headers, 'set-cookies').should.equal(false);
        });

        it('should not logout without auth', async () => {
            try {
                await chaiRequest.post('/logout');
            } catch (err) {
                err.response.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.controllers.auth.authorizationRequired);
            }
        });
    });
});
