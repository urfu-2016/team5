/* global it, describe, beforeEach */

require('chai').should();
const User = require('../../models/user');
const usersMocks = require('../mocks/users');
const constants = require('../../constants/constants');
const mongoose = require('../../libs/mongoose-connection');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;

describe('models:user', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should create model', async () => {
        const userData = usersMocks.regularUser;
        const savedUser = await User.create(userData);

        savedUser.username.should.equal(userData.username);
    });

    it('fails creation of account if it already exists', () => {
        const userData = usersMocks.regularUser;

        return User
            .create(userData)
            .then(() => User.create(userData))
            .catch(err => err.code.should.be.equal(constants.mongoose.mongoDuplicateErrorCode));
    });

    it('should not create account without password', () => {
        const userData = usersMocks.regularUser;

        return User
            .create({username: userData.username})
            .catch(err => err.message.should.be.equal(constants.models.User.passwordRequiredMessage));
    });

    it('should not create account without username', () => {
        return User
            .create({password: usersMocks.regularUser.password})
            .catch(err => err.name.should.be.equal(constants.mongoose.validationErrorName));
    });

    it('gets true by verification a correct password', () => {
        return User
            .create(usersMocks.regularUser)
            .then(() => User.verifyPassword(usersMocks.regularUser))
            .then(res => res.should.be.equal(true));
    });

    it('fails verification on wrong password', () => {
        return User
            .create(usersMocks.regularUser)
            .then(() => User.verifyPassword(usersMocks.userWithIncorrectPassword))
            .catch(err => err.message.should.be.equal(constants.models.User.wrongPasswordOrNameMessage));
    });

    it('changes password', () => {
        const newPassword = 'newPassword';

        return User
            .create(usersMocks.regularUser)
            .then(() => User.changePassword(usersMocks.regularUser, newPassword))
            .then(() => User.verifyPassword({username: usersMocks.regularUser.username, password: newPassword}))
            .then(verificationResult => verificationResult.should.be.ok);
    });

    it('fails changing password on wrong old password', () => {
        return User
            .create(usersMocks.regularUser)
            .then(() => User.changePassword(usersMocks.userWithIncorrectPassword, usersMocks.regularUser.password))
            .catch(err => err.message.should.be.equal(constants.models.User.wrongPasswordOrNameMessage));
    });

    it('check that password was hashed', () => {
        const userData = usersMocks.regularUser;

        return User
            .create(userData)
            .then(() => User.find({}).exec())
            .then(users => users[0].password.should.not.be.equal(userData.password));
    });

    it('should update by username', async () => {
        const userData = usersMocks.regularUser;
        const firstname = 'Othername';

        const savedUser = await User.create(userData);
        const updatedUser = await User.update(savedUser.username, {firstname});

        updatedUser.firstname.should.equal(firstname);
    });

    it('should get by username', async () => {
        const userData = usersMocks.regularUser;

        const savedUser = await User.create(userData);
        const foundUser = await User.getByUsername(savedUser.username);

        foundUser.username.should.equal(userData.username);
    });

    it('should get by id', async () => {
        const userData = usersMocks.regularUser;

        const savedUser = await User.create(userData);
        const foundUser = await User.getById(savedUser._id);

        foundUser.username.should.equal(userData.username);
    });

    it('should remove by username', async () => {
        const userData = usersMocks.regularUser;

        const savedUser = await User.create(userData);
        await User.removeByUsername(savedUser.username);
        const user = await User.getByUsername(userData.username);

        (user === null).should.be.equal(true);
    });
});
