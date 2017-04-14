/* eslint-env mocha */

const server = require('../../app');
const httpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);

const constants = require('../../constants/constants');
const mocks = require('../mocks/account');

function signUpAccount(account) {
    return chaiRequest.post('/signup', account);
}

function signInAccount(account) {
    return chaiRequest.post('/signin', account);
}

describe('controller:auth', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('signup', () => {
        it('should sign up new user', () => {
            return signUpAccount(mocks.accWithCorrectPassword)
                .then(res => res.status.should.be.equal(httpStatus.CREATED));
        });

        it('should fail sign up for already used username', () => {
            return signUpAccount(mocks.accWithCorrectPassword)
                .then(() => signUpAccount(mocks.accWithCorrectPassword))
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
            return signUpAccount(mocks.accWithCorrectPassword)
                .then(() => signInAccount(mocks.accWithCorrectPassword))
                .then(res => {
                    const username = mocks.accWithCorrectPassword.username;
                    res.body.data.message.should.equal(constants.controllers.auth.signedInPattern(username));
                });
        });

        it('should fails sign in with wrong password', () => {
            return signUpAccount(mocks.accWithCorrectPassword)
                .then(() => signInAccount(mocks.accWithIncorrectPassword))
                .catch(err => {
                    err.response.body.message.should.equal(constants.models.Account.wrongPasswordOrNameMessage);
                    err.status.should.equal(httpStatus.BAD_REQUEST);
                });
        });

        it('should fails sign in to non-existent account', () => {
            return signInAccount(mocks.accWithCorrectPassword)
                .catch(err => {
                    err.status.should.equal(httpStatus.BAD_REQUEST);
                    err.response.body.message.should.equal(constants.models.Account.wrongPasswordOrNameMessage);
                });
        });
    });
});
