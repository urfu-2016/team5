/* global it, describe, beforeEach */

require('chai').should();
const mongoose = require('mongoose');
const User = require('../../models/user');
const usersMocks = require('../mocks/users');
const removeAllUsers = require('../../scripts/clear-db').removeAllUsers;

describe('models:user', () => {
    beforeEach(() => removeAllUsers());

    after(() => removeAllUsers());

    it('should create model', () => {
        const userData = usersMocks.regularUser;

        return User.create(userData)
            .then(savedUser => {
                savedUser.firstname.should.equal(userData.firstname);
                savedUser.username.should.equal(userData.username);
                savedUser.surname.should.equal(userData.surname);
            });
    });

    it('error on save without required parameter', () => {
        const userData = usersMocks.userWithoutRequiredFields;
        const ValidationError = mongoose.Error.ValidationError;

        return User.create(userData)
            .catch(error => {
                error.name.should.equal(ValidationError.name);
            });
    });

    it('should update by username', () => {
        const userData = usersMocks.regularUser;
        const firstname = 'Othername';

        return User.create(userData)
            .then(savedUser => User.update(savedUser.username, {firstname}))
            .then(updatedUser => updatedUser.firstname.should.equal(firstname));
    });

    it('should get by username', () => {
        const userData = usersMocks.regularUser;

        return User.create(userData)
            .then(savedUser => User.getByUsername(savedUser.username))
            .then(foundedUser => foundedUser.username.should.equal(userData.username));
    });

    it('should remove by username', () => {
        const userData = usersMocks.regularUser;

        return User.create(userData)
            .then(savedUser => User.removeByUsername(savedUser.username))
            .then(() => User.getByUsername(userData.username))
            .then(user => (user === null).should.be.true);
    });
});
