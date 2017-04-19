
/* eslint-env mocha */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const slugify = require('slug');
const questsMocks = require('../mocks/quests');
const userMocks = require('../mocks/users');
const User = require('../../models/user');
const createQuestWithAuthor = require('../../scripts/generate-db-data').createQuestWithAuthor;
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);

const questData = questsMocks.regularQuest;

async function getCookie(user) {
    await User.create(user);

    return await chaiRequest.signInAndGetCookies(user);
}

async function createQuestWithCookie(cookies) {
    return await (chaiRequest
        .post('/api/quests', questData)
        .set('cookies', cookies));
}

describe('controller:quest', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should create the quest', async () => {
        const cookies = await getCookie(userMocks.regularUser);
        const res = await createQuestWithCookie(cookies);
        await chaiRequest.post('/logout').set('cookies', cookies);

        res.status.should.equal(HttpStatus.CREATED);
        res.body.data.title.should.equal(questData.title);
        res.body.data.slug.should.equal(slugify(questData.title));
    });

    it('should GET all the quests', async () => {
        await createQuestWithAuthor(questData);
        await createQuestWithAuthor(questData);

        const res = await chaiRequest.get('/api/quests');

        res.status.should.equal(HttpStatus.OK);
        res.body.data.should.length.of.at(2);
    });

    it('should GET a quest by the given slug', async () => {
        const slug = slugify(questData.title);

        await createQuestWithAuthor(questData);
        const res = await chaiRequest.get(`/api/quests/${slug}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.slug.should.equal(slug);
    });

    it('should PUT a quest', async () => {
        const slug = slugify(questData.title);
        const updateData = {
            title: 'SomeOther',
            description: 'SomeOtherDescription'
        };

        const cookies = await getCookie(userMocks.regularUser);
        await createQuestWithCookie(cookies);

        const res = await chaiRequest
            .put(`/api/quests/${slug}`, updateData)
            .set('cookies', cookies);
        await chaiRequest.post('/logout').set('cookies', cookies);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.title.should.equal(updateData.title);
        res.body.data.description.should.equal(updateData.description);
    });

    it('should delete a quest', async () => {
        const slug = slugify(questData.title);
        const cookies = await getCookie(userMocks.regularUser);
        await createQuestWithCookie(cookies);
        const res = await chaiRequest
            .delete(`/api/quests/${slug}`)
            .set('cookies', cookies);
        await chaiRequest.post('/logout').set('cookies', cookies);

        res.status.should.equal(HttpStatus.OK);
    });

    it('should answer with status 404', async () => {
        try {
            await chaiRequest.get(`/api/quests/some-bad-slug`);
        } catch (err) {
            err.status.should.equal(HttpStatus.NOT_FOUND);
        }
    });
});
