/* eslint-env mocha */

const server = require('../../app');
const httpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const constants = require('../../constants/constants');
const mocks = require('../mocks/users');

describe('controller:auth', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('signup', () => {
        it('should sign up new user', async () => {
            const res = await chaiRequest.post('/signup', mocks.userWithCorrectPassword);
            const username = mocks.userWithCorrectPassword.username;

            res.status.should.be.equal(httpStatus.CREATED);
            res.text.should.be.equal(constants.controllers.auth.signedUpPattern(username));
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
    });

    describe('signin', () => {
        it('should sign in by username with correct password', async () => {
            const userData = mocks.userWithCorrectPassword;
            await chaiRequest.post('/signup', userData);
            const res = await chaiRequest.post('/signin', {
                login: userData.username,
                password: userData.password
            });

            res.body.message.should.equal(constants.controllers.auth.signedInPattern(userData.username));
        });

        it('should sign in by email with correct password', async () => {
            const userData = mocks.userWithCorrectPassword;
            await chaiRequest.post('/signup', userData);
            const res = await chaiRequest.post('/signin', {
                login: userData.email,
                password: userData.password
            });

            res.body.message.should.equal(constants.controllers.auth.signedInPattern(userData.username));
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

    describe('logout', () => {
        beforeEach(() => chaiRequest.post('/signup').send(mocks.userWithCorrectPassword));

        it('should end session after logout', async () => {
            await chaiRequest.post('/signin').send(mocks.userWithCorrectPassword);
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
