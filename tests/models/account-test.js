const accountModel = require('../../models/account');
const Account = require('mongoose').model('Account');
const User = require('mongoose').model('User');
require('chai').should();

const account = {
    username: 'username',
    password: 'password'
};

describe('models:Account', () => {
    beforeEach(() => {
        return Account.remove({}).exec()
            .then(() => User.remove({}).exec());
    });

    it('creates account', () => {
        return accountModel
           .create(account)
           .then(() => Account.find({}).exec())
           .then(accounts => {
               accounts.length.should.be.equal(1);
               accounts[0].get('username').should.be.equal(account.username);
           });
    });

    it('create user with account', () => {
        return accountModel
            .create(account)
            .then(() => User.find({}).exec())
            .then(users => {
                users.length.should.be.equal(1);
                users[0].username.should.be.equal(account.username);
            });
    });

    it('check that password was hashed', () => {
        return accountModel
           .create(account)
           .then(() => User.find({}).exec())
           .then(users => {
               users[0].password.should.not.be.equal(account.password);
           });
    });

    it('fails creation account if user exists', () => {
        const userObject = {username: account.username};
        const user = new User(userObject);

        return user
            .save()
            .then(() => accountModel.create(account))
            .catch(err => {
                err.code.should.be.equal(11000);

                return accountModel
                    .find(userObject)
                    .exec()
                    .then(accounts => accounts.length.should.be.equal(0));
            });
    });

    it('should not create account without password', () => {
        return accountModel
           .create({username: account.username})
           .catch(err => err.message.should.be.equal('Password required'));
    });

    it('should not create account without username', () => {
        return accountModel
            .create({password: account.password})
            .catch(err => err.name.should.be.equal('ValidationError'));
    });

    it('verifies password', () => {
        return accountModel
            .create(account)
            .then(() => accountModel.verifyPassword(account))
            .then(res => res.should.be.equal(true));
    });

    it('changes password', () => {
        const newPassword = 'newPassword';

        return accountModel
            .create(account)
            .then(() => accountModel.changePassword(account, newPassword))
            .then(() => {
                return accountModel.verifyPassword({
                    username: account.username,
                    password: newPassword
                });
            })
            .then(verificationResult => verificationResult.should.be.equal(true))
            .then(() => Account.find({}).exec())
            .then(accs => accs.length.should.be.equal(1));
    });
});
