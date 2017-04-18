'use strict';

const Account = require('../../models/account');
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

    it('creates account', async () => {
        await Account.create(account);

        const accounts = await Account.find({}).exec();

        accounts.length.should.be.equal(1);
        accounts[0].username.should.be.equal(account.username);
    });

    it('checks, that id was set', async () => {
        const acc = await Account.create(account);

        acc.username.should.be.equal(account.username);
    });

    it('checks correctness of ref', async () => {
        const acc = await Account.create(account);
        const user = await User.getByUsername(account.username);

        user._id.should.be.deep.equal(acc.user);
    });

    it('create user with account', async () => {
        await Account.create(account);

        const allUsers = await User.getAll();

        allUsers.length.should.be.equal(1);
        allUsers[0].username.should.be.equal(account.username);
    });

    it('check that password was hashed', async () => {
        await Account.create(account);

        const accounts = await Account.find({}).exec();

        accounts[0].password.should.not.be.equal(account.password);
    });

    it('fails creation of account if user exists', async () => {
        const userObject = {username: account.username};

        await User.create(userObject);

        try {
            await Account.create(account);
        } catch (err) {
            err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode);

            const accounts = await Account.find(userObject).exec();

            accounts.length.should.equal(0);
        }
    });

    it('fails creation of account if it already exists', async () => {
        await Account.create(account);

        try {
            await Account.create(account);
        } catch (err) {
            err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode);
        }
    });

    it('should not create account without password', async () => {
        try {
            await Account.create({username: account.username});
        } catch (err) {
            err.message.should.be.equal(constants.models.Account.passwordRequiredMessage);
        }
    });

    it('should not create account without username', async () => {
        try {
            await Account.create({password: account.password});
        } catch (err) {
            err.name.should.be.equal(constants.mongoose.validationErrorName);
        }
    });

    it('gets true by verification a correct password', async () => {
        await Account.create(account);

        const res = await Account.verifyPassword(account);

        res.should.be.equal(true);
    });

    it('fails verification on wrong password', async () => {
        await Account.create(account);

        try {
            await Account.verifyPassword(accountWithWrongPassword);
        } catch (err) {
            err.message.should.be.equal(constants.models.Account.wrongPasswordOrNameMessage);
        }
    });

    it('changes password', async () => {
        const newPassword = 'newPassword';

        await Account.create(account);
        await Account.changePassword(account, newPassword);

        await Account.verifyPassword({username: account.username, password: newPassword}).should.be.ok;
    });

    it('fails changing password on wrong old password', async () => {
        await Account.create(account);

        try {
            await Account.changePassword(accountWithWrongPassword, account.password);
        } catch (err) {
            err.message.should.be.equal(constants.models.Account.wrongPasswordOrNameMessage);
        }
    });
});
