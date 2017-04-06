/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
// const Account = require('../../models/account');
const httpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');

chai.should();
chai.use(chaiHttp);

const account = {username: 'A', password: 'B'};

describe('controller:auth', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should sign up new user', () => {
        return chai
            .request(server)
            .post('/signup')
            .send(account)
            .then(res => {
                res.status.should.be.equal(httpStatus.CREATED);
            });
    });

    it('should fail sign up for already used username', () => {
        return chai
            .request(server)
            .post('/signup')
            .send(account)
            .then(() => {
                return chai
                    .request(server)
                    .post('/signup')
                    .send(account);
            })
            .catch(err => {
                err.status.should.be.equal(httpStatus.BAD_REQUEST);
                err.response.body.message.should.be.equal(`${account.username} already exists`);
            });
    });
});
