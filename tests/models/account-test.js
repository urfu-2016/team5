const Account = require('../../models/account');
const AccountMongo = require('mongoose').model('Account');
const User = require('../../models/user');
const DBClearer = require('../../scripts/clear-db');
require('chai').should();

const MongoDuplicateErrorCode = 11000;

const account = {
    username: 'username',
    password: 'password'
};

describe('models:Account', () => {
    beforeEach(() => {
        DBClearer.clearWholeDB();
    });

    it('creates account', () => {
        return Account
           .create(account)
           .then(() => AccountMongo.find({}).exec())
           .then(accounts => {
               accounts.length.should.be.equal(1);
               accounts[0].get('username').should.be.equal(account.username);
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
           .then(users => {
               users[0].password.should.not.be.equal(account.password);
           });
    });

    it('fails creation of account if user exists', () => {
        const userObject = {username: account.username};

        return User
            .create(userObject)
            .then(() => Account.create(account))
            .catch(err => {
                err.code.should.be.equal(MongoDuplicateErrorCode);

                return AccountMongo
                    .find(userObject)
                    .exec()
                    .then(accounts => accounts.length.should.be.equal(0));
            });
    });

    it('fails creation of account if it already exists', () => {
        return Account
            .create(account)
            .then(() => Account.create(account))
            .catch(err => err.code.should.be.equal(MongoDuplicateErrorCode));
    });

    it('should not create account without password', () => {
        return Account
           .create({username: account.username})
           .catch(err => err.message.should.be.equal('Password required'));
    });

    it('should not create account without username', () => {
        return Account
            .create({password: account.password})
            .catch(err => err.name.should.be.equal('ValidationError'));
    });

    it('verifies password', () => {
        return Account
            .create(account)
            .then(() => Account.verifyPassword(account))
            .then(res => res.should.be.equal(true));
    });

    it('changes password', () => {
        const newPassword = 'newPassword';

        return Account
            .create(account)
            .then(() => Account.changePassword(account, newPassword))
            .then(() => {
                return Account.verifyPassword({
                    username: account.username,
                    password: newPassword
                });
            })
            .then(verificationResult => verificationResult.should.be.equal(true))
            .then(() => AccountMongo.find({}).exec())
            .then(accs => accs.length.should.be.equal(1));
    });
});
