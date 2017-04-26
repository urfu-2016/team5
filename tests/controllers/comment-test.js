/* eslint-env mocha */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const userMocks = require('../mocks/users');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const constants = require('../../constants/controllers');

async function createComment(text) {
    return await chaiRequest.post('/api/comments', {text});
}

describe('controller:comment', () => {
    beforeEach(async () => {
        await dbClearer.removeAll();
        await chaiRequest.createUserAndSignIn(userMocks.userWithCorrectPassword);
    });

    after(() => dbClearer.removeAll());

    describe('success with auth', () => {
        afterEach(() => chaiRequest.logout());

        it('should create the comment', async () => {
            const message = 'msg';
            const res = await createComment(message);
            res.status.should.equal(HttpStatus.CREATED);
            res.body.data.message.should.equal(message);
            res.body.data.isAuthor.should.equal(true);
        });

        it('should delete a comment', async () => {
            const commentId = (await createComment('blah')).body.data.id;
            const res = await chaiRequest.delete(`/api/comments/${commentId}`);

            res.status.should.equal(HttpStatus.OK);
        });
    });

    describe('fails without auth', () => {
        it('should not create the comment without auth', async () => {
            await chaiRequest.logout();

            try {
                await createComment('blah');
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
            }
        });

        it('should not delete a comment without auth', async () => {
            const commentId = (await createComment('blah')).body.data.id;
            await chaiRequest.logout();

            try {
                await chaiRequest.delete(`/api/comments/${commentId}`);
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
            }
        });

        it('should not delete a comment by not author', async () => {
            const commentId = (await createComment('blah')).body.data.id;
            await chaiRequest.logout();

            const user = {username: 'hacker', password: '$o_S+r0n9_Pa$$woгd'};
            await chaiRequest.createUserAndSignIn(user);

            try {
                await chaiRequest.delete(`/api/comments/${commentId}`);
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.auth.permissionDenied);
            }

            await chaiRequest.logout();
        });
    });

    it('should GET a comment by the given id', async () => {
        const message = 'blah';
        const commentId = (await createComment(message)).body.data.id;
        const res = await chaiRequest.get(`/api/comments/${commentId}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.id.should.equal(commentId);
        res.body.data.message.should.equal(message);
    });

    it('should GET all the comments', async () => {
        await createComment('Blah');
        await createComment('Bleh');
        await createComment('Bluh');

        const res = await chaiRequest.get('/api/comments');

        res.status.should.equal(HttpStatus.OK);
        res.body.data.should.length.of.at(3);
    });

    it('should be liked by user', async () => {
        const comment = (await createComment('Blah')).body.data;
        await chaiRequest.post(`/api/comments/${comment.id}/like`);
        const res = await chaiRequest.get(`/api/comments/${comment.id}`);
        res.body.data.likesCount.should.equal(1);
    });

    it('shouldn\'t be liked by user twice', async () => {
        const comment = (await createComment('Blah')).body.data;
        await chaiRequest.post(`/api/comments/${comment.id}/like`);
        await chaiRequest.post(`/api/comments/${comment.id}/like`);
        const res = await chaiRequest.get(`/api/comments/${comment.id}`);
        res.body.data.likesCount.should.equal(0);
    });
});
