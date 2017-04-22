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
            const res = await chaiRequest.post('/signup', mocks.UserWithCorrectPassword);

            res.status.should.be.equal(httpStatus.CREATED);
        });

        it('should fail sign up for already used username', async () => {
            await chaiRequest.post('/signup', mocks.UserWithCorrectPassword);
            try {
                await chaiRequest.post('/signup', mocks.UserWithCorrectPassword);
            } catch (err) {
                const username = mocks.UserWithCorrectPassword.username;
                const message = constants.models.user.alreadyExistsPattern(username);

                err.status.should.be.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.be.equal(message);
            }
        });
    });

    describe('signin', () => {
        it('should sign in with correct password', async () => {
            await chaiRequest.post('/signup', mocks.UserWithCorrectPassword);
            const res = await chaiRequest.post('/signin', mocks.UserWithCorrectPassword);

            const username = mocks.UserWithCorrectPassword.username;
            res.body.message.should.equal(constants.controllers.auth.signedInPattern(username));
        });

        it('should fails sign in with wrong password', async () => {
            await chaiRequest.post('/signup', mocks.UserWithCorrectPassword);
            try {
                await chaiRequest.post('/signin', mocks.userWithIncorrectPassword);
            } catch (err) {
                err.response.text.should.equal(constants.models.user.wrongPasswordOrNameMessage);
                err.status.should.equal(httpStatus.BAD_REQUEST);
            }
        });

        it('should fails sign in to non-existent account', async () => {
            try {
                await chaiRequest.post('/signin', mocks.UserWithCorrectPassword);
            } catch (err) {
                err.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.models.user.wrongPasswordOrNameMessage);
            }
        });
    });

    describe('logout', () => {
        beforeEach(() => chaiRequest.post('/signup').send(mocks.UserWithCorrectPassword));

        it('should end session after logout', async () => {
            await chaiRequest.post('/signin').send(mocks.UserWithCorrectPassword);
            const res = await chaiRequest.post('/logout');

            Object.prototype.hasOwnProperty.call(res.headers, 'set-cookies').should.equal(false);
        });

        it('should not logout without auth', async () => {
            try {
                await chaiRequest.post('/logout');
            } catch (err) {
                err.response.status.should.equal(httpStatus.BAD_REQUEST);
            }
        });
    });
});
