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

    it('should GET all the users', async () => {
        const userData = userMocks.regularUser;

        await User.create(userData);
        const res = await chaiRequest.get('/api/users');

        res.status.should.equal(HttpStatus.OK);
        res.body.data.should.length.of.at(1);
    });

    it('should GET a user by the given username', async () => {
        const userData = userMocks.regularUser;

        await User.create(userData);
        const res = await chaiRequest.get(`/api/users/${userData.username}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.username.should.equal(userData.username);
    });

    it('should answer with status 404', async () => {
        try {
            await chaiRequest.get(`/api/users/some-bad-username`);
        } catch (err) {
            err.status.should.equal(HttpStatus.NOT_FOUND);
        }
    });
});
