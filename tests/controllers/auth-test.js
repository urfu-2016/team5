/* eslint-env mocha */

const server = require('../../app');
const httpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);

const constants = require('../../constants/constants');
const mocks = require('../mocks/account');

describe('controller:auth', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('signup', () => {
        it('should sign up new user', () => {
            return chaiRequest.post('/signup', mocks.accWithCorrectPassword)
                .then(res => res.status.should.be.equal(httpStatus.CREATED));
        });

        it('should fail sign up for already used username', () => {
            return chaiRequest.post('/signup', mocks.accWithCorrectPassword)
                .then(() => chaiRequest.post('/signup', mocks.accWithCorrectPassword))
                .catch(err => {
                    const username = mocks.accWithCorrectPassword.username;
                    const message = constants.models.Account.alreadyExistsPattern(username);

                    err.status.should.be.equal(httpStatus.BAD_REQUEST);
                    err.response.body.message.should.be.equal(message);
                });
        });
    });

    describe('signin', () => {
        it('should sign in with correct password', () => {
            return chaiRequest.post('/signup', mocks.accWithCorrectPassword)
                .then(() => chaiRequest.post('/signin', mocks.accWithCorrectPassword))
                .then(res => {
                    const username = mocks.accWithCorrectPassword.username;
                    res.body.data.message.should.equal(constants.controllers.auth.signedInPattern(username));
                });
        });

        it('should fails sign in with wrong password', () => {
            return chaiRequest.post('/signup', mocks.accWithCorrectPassword)
                .then(() => chaiRequest.post('/signin', mocks.accWithIncorrectPassword))
                .catch(err => {
                    err.response.body.message.should.equal(constants.models.Account.wrongPasswordOrNameMessage);
                    err.status.should.equal(httpStatus.BAD_REQUEST);
                });
        });

        it('should fails sign in to non-existent account', () => {
            return chaiRequest.post('/signin', mocks.accWithCorrectPassword)
                .catch(err => {
                    err.status.should.equal(httpStatus.BAD_REQUEST);
                    err.response.body.message.should.equal(constants.models.Account.wrongPasswordOrNameMessage);
                });
        });
    });
});
