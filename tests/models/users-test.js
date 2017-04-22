/* global it, describe, beforeEach */

require('chai').should();
const User = require('../../models/user');
const usersMocks = require('../mocks/users');
const constants = require('../../constants/constants');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;

describe('models:user', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should create model', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        const savedUser = await User.create(userData);

        savedUser.username.should.equal(userData.username);
    });

    it('fails creation of account if it already exists', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        await User.create(userData);

        try {
            await User.create(userData);
        } catch (err) {
            err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode);
        }
    });

    it('should not create account without password', async () => {
        try {
            await User.create({username: usersMocks.UserWithCorrectPassword.username});
        } catch (err) {
            err.message.should.be.equal(constants.models.user.passwordRequiredMessage);
        }
    });

    it('should not create account without username', async () => {
        try {
            await User.create({password: usersMocks.UserWithCorrectPassword.password});
        } catch (err) {
            err.name.should.be.equal(constants.mongoose.validationErrorName);
        }
    });

    it('gets true by verification a correct password', async () => {
        await User.create(usersMocks.UserWithCorrectPassword);
        const result = await User.verifyPassword(usersMocks.UserWithCorrectPassword);

        result.should.be.equal(true);
    });

    it('fails verification on wrong password', async () => {
        await User.create(usersMocks.UserWithCorrectPassword);

        try {
            await User.verifyPassword(usersMocks.userWithIncorrectPassword);
        } catch (err) {
            err.message.should.be.equal(constants.models.user.wrongPasswordOrNameMessage);
        }
    });

    it('changes password', async () => {
        const newPassword = 'newPassword';
        await User.create(usersMocks.UserWithCorrectPassword);
        await User.changePassword(usersMocks.UserWithCorrectPassword, newPassword);
        const result = await User.verifyPassword({username: usersMocks.UserWithCorrectPassword.username, password: newPassword});

        result.should.be.equal(true);
    });

    it('fails changing password on wrong old password', async () => {
        await User.create(usersMocks.UserWithCorrectPassword);

        try {
            await User.changePassword(usersMocks.userWithIncorrectPassword, usersMocks.UserWithCorrectPassword.password);
        } catch (err) {
            err.message.should.be.equal(constants.models.user.wrongPasswordOrNameMessage);
        }
    });

    it('check that password was hashed', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        await User.create(userData);
        const user = await User.getByUsername(userData.username);

        user.password.should.not.be.equal(userData.password);
    });

    it('should update by username', async () => {
        const firstname = 'Othername';
        const savedUser = await User.create(usersMocks.UserWithCorrectPassword);
        const updatedUser = await User.update(savedUser.username, {firstname});

        updatedUser.firstname.should.equal(firstname);
    });

    it('should get by username', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        const savedUser = await User.create(userData);
        const foundUser = await User.getByUsername(savedUser.username);

        foundUser.username.should.equal(userData.username);
    });

    it('should get by id', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        const savedUser = await User.create(userData);
        const foundUser = await User.getById(savedUser._id);

        foundUser.username.should.equal(userData.username);
    });

    it('should remove by username', async () => {
        const userData = usersMocks.UserWithCorrectPassword;
        const savedUser = await User.create(userData);
        await User.removeByUsername(savedUser.username);
        const user = await User.getByUsername(userData.username);

        (user === null).should.be.equal(true);
    });
});
