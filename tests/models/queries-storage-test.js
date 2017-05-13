/* eslint-env mocha */

require('chai').should();
const dbClearer = require('../../scripts/clear-db');
const QueriesStorage = require('../../models/queriesStorage');
const mocks = require('../mocks/users');
const email = mocks.userWithCorrectPassword.email;

describe('queries-storage:model', () => {
    beforeEach(async () => {
        await dbClearer.removeAll();
    });

    it('creates email verification query', async () => {
        await QueriesStorage.updateEmailConfirmationQuery(email);
        const queries = await QueriesStorage.find({}).exec();

        queries.length.should.equal(1);
        queries[0].email.should.equal(email);
        queries[0].emailConfirmation.should.not.equal(undefined);
        queries[0].emailConfirmation.salt.should.not.equal(undefined);
        queries[0].emailConfirmation.createdAt.should.not.equal(undefined);
    });

    it('verifies email confirmation query', async () => {
        const hash = await QueriesStorage.updateEmailConfirmationQuery(email);
        const result = await QueriesStorage.verifyEmailConfirmationQuery(email, hash);

        result.should.equal(true);
    });

    it('creates password reset query', async () => {
        await QueriesStorage.updatePasswordResetQuery(email);
        const queries = await QueriesStorage.find({}).exec();

        queries.length.should.equal(1);
        queries[0].email.should.equal(email);
        queries[0].passwordReset.should.not.equal(undefined);
        queries[0].passwordReset.salt.should.not.equal(undefined);
        queries[0].passwordReset.createdAt.should.not.equal(undefined);
    });

    it('verifies password reset query', async () => {
        const hash = await QueriesStorage.updatePasswordResetQuery(email);
        const result = await QueriesStorage.verifyPasswordResetQuery(email, hash);

        result.should.equal(true);
    });

    it('deletes correct email query after verification', async () => {
        const hash = await QueriesStorage.updateEmailConfirmationQuery(email);
        await QueriesStorage.verifyEmailConfirmationQuery(email, hash);
        const query = await QueriesStorage.findOne({email});

        (query.emailConfirmation === undefined).should.equal(true);
    });

    it('deletes password reset query after verification', async () => {
        const hash = await QueriesStorage.updatePasswordResetQuery(email);
        await QueriesStorage.verifyPasswordResetQuery(email, hash);
        const query = await QueriesStorage.findOne({email});

        (query.passwordReset === undefined).should.equal(true);
    });

    it('check should return true on correct password reset query', async () => {
        const hash = await QueriesStorage.updatePasswordResetQuery(email);
        const result = await QueriesStorage.checkPasswordResetQuery(email, hash);

        result.should.equal(true);
    });

    it('check should return false on wrong password reset query', async () => {
        const hash = '0' + await QueriesStorage.updatePasswordResetQuery(email);
        const result = await QueriesStorage.checkPasswordResetQuery(email, hash);

        result.should.equal(false);
    });
});
