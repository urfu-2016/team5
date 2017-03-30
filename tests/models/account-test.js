const Account = require('../../models/account');
const AccountMongo = require('mongoose').model('Account');
const UserModel = require('mongoose').model('User');
require('chai').should();

const account = {
    username: 'username',
    password: 'password'
};

describe('models:Account', () => {
    beforeEach(() => {
        return AccountMongo.remove({}).exec()
            .then(() => UserModel.remove({}).exec());
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
            .then(() => UserModel.find({}).exec())
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

    it('fails creation account if user exists', () => {
        const userObject = {username: account.username};
        const user = new UserModel(userObject);

        return user
            .save()
            .then(() => Account.create(account))
            .catch(err => {
                err.code.should.be.equal(11000);

                return AccountMongo
                    .find(userObject)
                    .exec()
                    .then(accounts => accounts.length.should.be.equal(0));
            });
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
