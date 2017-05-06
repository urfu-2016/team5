/* eslint-env mocha */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const userMocks = require('../mocks/users');
const questMocks = require('../mocks/quests');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const constants = require('../../constants/controllers');

function createComment(text, questSlug) {
    return chaiRequest.post(`/api/comments/${questSlug}`, {text});
}

describe('controller:comment', () => {
    let quest;

    beforeEach(async () => {
        await dbClearer.removeAll();
        await chaiRequest.createUserAndSignIn(userMocks.userWithCorrectPassword);
        const questData = questMocks.regularQuest;
        quest = (await chaiRequest.post('/api/quests', questData)).body.data;
    });

    after(() => dbClearer.removeAll());

    describe('success with auth', () => {
        afterEach(() => chaiRequest.logout());

        it('should create the comment', async () => {
            const message = 'msg';
            const res = await createComment(message, quest.slug);
            res.status.should.equal(HttpStatus.CREATED);
            res.body.data.message.should.equal(message);
            res.body.data.isAuthor.should.equal(true);
        });

        it('should delete a comment', async () => {
            const comment = (await createComment('blah', quest.slug)).body.data;
            const res = await chaiRequest.delete(`/api/comments/${quest.slug}/${comment.id}`);

            res.status.should.equal(HttpStatus.OK);
        });
    });

    describe('fails without auth', () => {
        it('should not create the comment without auth', async () => {
            await chaiRequest.logout();
            try {
                await createComment('blah', quest.slug);
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
            }
        });

        it('should not delete a comment without auth', async () => {
            const comment = (await createComment('blah', quest.slug)).body.data;
            await chaiRequest.logout();

            try {
                await chaiRequest.delete(`/api/comments/${quest.slug}/${comment.id}`);
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
            }
        });

        it('should not delete a comment by not author', async () => {
            const comment = (await createComment('blah', quest.slug)).body.data;
            await chaiRequest.logout();
            const user = {
                username: 'hacker', password: '$o_S+r0n9_Pa$$woгd',
                email: 'some@mail.ru', login: 'hacker'
            };
            await chaiRequest.createUserAndSignIn(user);

            try {
                await chaiRequest.delete(`/api/comments/${quest.slug}/${comment.id}`);
            } catch (err) {
                err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                err.response.text.should.equal(constants.auth.permissionDenied);
            }
        });
    });

    it('should GET a comment by id', async () => {
        const message = 'blah';
        const comment = (await createComment(message, quest.slug)).body.data;
        const res = await chaiRequest.get(`/api/comments/${quest.slug}/${comment.id}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.message.should.equal(message);
    });

    it('should GET all the comments', async () => {
        await createComment('Blah', quest.slug);
        await createComment('Bleh', quest.slug);
        await createComment('Bluh', quest.slug);

        const res = await chaiRequest.get(`/api/comments/${quest.slug}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.should.length.of.at(3);
    });

    it('should be liked by user', async () => {
        const comment = (await createComment('Blah', quest.slug)).body.data;
        await chaiRequest.post(`/api/comments/${quest.slug}/${comment.id}/like`);
        const res = await chaiRequest.get(`/api/comments/${quest.slug}/${comment.id}`);
        res.body.data.likesCount.should.equal(1);
    });

    it('shouldn\'t be liked by user twice', async () => {
        const comment = (await createComment('Blah', quest.slug)).body.data;
        await chaiRequest.post(`/api/comments/${quest.slug}/${comment.id}/like`);
        await chaiRequest.post(`/api/comments/${quest.slug}/${comment.id}/like`);
        const res = await chaiRequest.get(`/api/comments/${quest.slug}/${comment.id}`);
        res.body.data.likesCount.should.equal(0);
    });

    it('should return comments for not authorized user', async () => {
        // Из-за того, что у незалогиненного пользователя нет сессии,
        // нельзя проверить, лайкал он коммент или нет. Бекенд падал
        const comment = (await createComment('Blah', quest.slug)).body.data;
        await chaiRequest.post(`/api/comments/${quest.slug}/${comment.id}/like`);
        await chaiRequest.logout();

        const res = await chaiRequest.get(`/api/comments/${quest.slug}`);
        res.body.data.length.should.not.equal(0);
        (res.body.data.liked === undefined).should.be.equal(true);
    });
});
