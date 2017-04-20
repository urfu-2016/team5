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
            const res = await chaiRequest.post('/signup', mocks.regularUser);

            res.status.should.be.equal(httpStatus.CREATED);
        });

        it('should fail sign up for already used username', async () => {
            await chaiRequest.post('/signup', mocks.regularUser);
            try {
                await chaiRequest.post('/signup', mocks.regularUser);
            } catch (err) {
                const username = mocks.regularUser.username;
                const message = constants.models.user.alreadyExistsPattern(username);

                err.status.should.be.equal(httpStatus.BAD_REQUEST);
                err.response.body.message.should.be.equal(message);
            }
        });
    });

    describe('signin', () => {
        it('should sign in with correct password', async () => {
            await chaiRequest.post('/signup', mocks.regularUser);
            const res = await chaiRequest.post('/signin', mocks.regularUser);

            const username = mocks.regularUser.username;
            res.body.data.message.should.equal(constants.controllers.auth.signedInPattern(username));
        });

        it('should fails sign in with wrong password', async () => {
            await chaiRequest.post('/signup', mocks.regularUser);
            try {
                await chaiRequest.post('/signin', mocks.userWithIncorrectPassword);
            } catch (err) {
                err.response.body.message.should.equal(constants.models.user.wrongPasswordOrNameMessage);
                err.status.should.equal(httpStatus.BAD_REQUEST);
            }
        });

        it('should fails sign in to non-existent account', async () => {
            try {
                await chaiRequest.post('/signin', mocks.regularUser);
            } catch (err) {
                err.status.should.equal(httpStatus.BAD_REQUEST);
                err.response.body.message.should.equal(constants.models.user.wrongPasswordOrNameMessage);
            }
        });
    });
});
