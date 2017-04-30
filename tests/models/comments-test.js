/* eslint-env mocha */

require('chai').should();
const mongoose = require('mongoose');
const Comment = require('../../models/comment');
const User = require('../../models/user');
const usersMocks = require('../mocks/users');
const dbClearer = require('../../scripts/clear-db');

describe('models:Comments', () => {
    let user;
    const message = 'Some comment to that quest';

    beforeEach(async () => {
        dbClearer.removeAll();
        const userData = usersMocks.userWithCorrectPassword;
        user = await User.create(userData);
    });

    after(() => dbClearer.removeAll());

    it('should create model', async () => {
        const comment = await Comment.create(user, message);
        comment.message.should.be.equal(message);
        (await comment.createdBy(user.username)).should.be.equal(true);
    });

    it('should error when message to long', async () => {
        const ValidationError = mongoose.Error.ValidationError;
        let message = '';
        for (let i = 0; i < 300; i++) {
            message += ' ';
        }
        try {
            await Comment.create(user, message);
        } catch (err) {
            err.name.should.equal(ValidationError.name);
        }
    });

    it('should be liked by user', async () => {
        const comment = await Comment.create(user, message);
        await comment.like(user);
        comment.likesCount.should.be.equal(1);
        (await comment.likedBy(user.username)).should.be.equal(true);
    });

    it('shouldn\'t be liked by user twice', async () => {
        const comment = await Comment.create(user, message);
        await comment.like(user);
        await comment.like(user);
        comment.likesCount.should.be.equal(0);
        (await comment.likedBy(user.username)).should.be.equal(false);
    });
});
