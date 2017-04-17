/* global it, describe, beforeEach */

require('chai').should();
const mongoose = require('mongoose');
const User = require('../../models/user');
const usersMocks = require('../mocks/users');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;

describe('models:user', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should create model', async () => {
        const userData = usersMocks.regularUser;

        const savedUser = await User.create(userData);

        savedUser.firstname.should.equal(userData.firstname);
        savedUser.username.should.equal(userData.username);
        savedUser.surname.should.equal(userData.surname);
    });

    it('error on save without required parameter', async () => {
        const userData = usersMocks.userWithoutRequiredFields;
        const ValidationError = mongoose.Error.ValidationError;

        try {
            await User.create(userData);
        } catch (err) {
            err.name.should.equal(ValidationError.name);
        }
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
