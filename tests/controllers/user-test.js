/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const User = require('../../models/user');
const userMocks = require('../mocks/users');
const HttpStatus = require('http-status-codes');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;

chai.should();
chai.use(chaiHttp);

describe('controller:quest', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should GET all the users', () => {
        const userData = userMocks.regularUser;

        return User.create(userData)
            .then(() => chai.request(server)
                .get('/api/users')
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.should.length.of.at(1);
                }));
    });

    it('should GET a user by the given username', () => {
        const userData = userMocks.regularUser;

        return User.create(userData)
            .then(() => chai.request(server)
                .get(`/api/users/${userData.username}`)
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.username.should.equal(userData.username);
                }));
    });

    it('should answer with status 404', () => {
        return chai
            .request(server)
            .get(`/api/users/some-bad-username`)
            .send()
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            });
    });
});
