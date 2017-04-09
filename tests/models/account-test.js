'use strict';

const Account = require('../../models/account');
const AccountMongo = require('mongoose').model('Account');
const User = require('../../models/user');
const DBClearer = require('../../scripts/clear-db');
require('chai').should();

const constants = require('../../constants/constants');
const account = {
    username: 'username',
    password: 'password'
};
const accountWithWrongPassword = {username: account.username, password: account.password + '0'};

describe('models:Account', () => {
    beforeEach(() => DBClearer.removeAll());

    after(() => DBClearer.removeAll());

    it('creates account', () => {
        return Account
           .create(account)
           .then(() => AccountMongo.find({}).exec())
           .then(accounts => {
               accounts.length.should.be.equal(1);
               accounts[0].get('username').should.be.equal(account.username);
           });
    });

    it('checks, that id was set', () => {
        return Account
           .create(account)
           .then(acc => acc.user.should.be.ok);
    });

    it('checks correctness of ref', () => {
        return Account
            .create(account)
            .then(acc => {
                return User
                    .getByUsername(account.username)
                    .then(user => user._id.should.be.deep.equal(acc.user));
            });
    });

    it('create user with account', () => {
        return Account
            .create(account)
            .then(() => User.getAll())
            .then(users => {
                users.length.should.be.equal(1);
                users[0].username.should.be.equal(account.username);
            });
    });

    it('check that password was hashed', () => {
        return Account
           .create(account)
           .then(() => AccountMongo.find({}).exec())
           .then(users => users[0].password.should.not.be.equal(account.password));
    });

    it('fails creation of account if user exists', () => {
        const userObject = {username: account.username};

        return User
            .create(userObject)
            .then(() => Account.create(account))
            .catch(err => {
                err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode);

                return AccountMongo
                    .find(userObject)
                    .exec()
                    .then(accounts => accounts.length.should.equal(0));
            });
    });

    it('fails creation of account if it already exists', () => {
        return Account
            .create(account)
            .then(() => Account.create(account))
            .catch(err => err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode));
    });

    it('should not create account without password', () => {
        return Account
           .create({username: account.username})
           .catch(err => err.message.should.be.equal(constants.models.Account.passwordRequiredMessage));
    });

    it('should not create account without username', () => {
        return Account
            .create({password: account.password})
            .catch(err => err.name.should.be.equal(constants.mongoose.validationErrorName));
    });

    it('gets true by verification a correct password', () => {
        return Account
            .create(account)
            .then(() => Account.verifyPassword(account))
            .then(res => res.should.be.equal(true));
    });

    it('fails verification on wrong password', () => {
        return Account
            .create(account)
            .then(() => Account.verifyPassword(accountWithWrongPassword))
            .catch(err => err.message.should.be.equal(constants.models.Account.wrongPasswordOrNameMessage));
    });

    it('changes password', () => {
        const newPassword = 'newPassword';

        return Account
            .create(account)
            .then(() => Account.changePassword(account, newPassword))
            .then(() => Account.verifyPassword({username: account.username, password: newPassword}))
            .then(verificationResult => verificationResult.should.be.ok);
    });

    it('fails changing password on wrong old password', () => {
        return Account
            .create(account)
            .then(() => Account.changePassword(accountWithWrongPassword, account.password))
            .catch(err => err.message.should.be.equal(constants.models.Account.wrongPasswordOrNameMessage));
    });
});
