/* eslint-env mocha */

const server = require('../../app');
const User = require('../../models/user');
const userMocks = require('../mocks/users');
const HttpStatus = require('http-status-codes');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);

describe('controller:users', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should GET all the users', () => {
        const userData = userMocks.regularUser;

        return User
            .create(userData)
            .then(() => chaiRequest.get('/api/users'))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.should.length.of.at(1);
            });
    });

    it('should GET a user by the given username', () => {
        const userData = userMocks.regularUser;

        return User
            .create(userData)
            .then(() => chaiRequest.get(`/api/users/${userData.username}`))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.username.should.equal(userData.username);
            });
    });

    it('should answer with status 404', () => {
        return chaiRequest
            .get(`/api/users/some-bad-username`)
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            });
    });
});
