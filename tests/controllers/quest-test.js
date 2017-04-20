
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

async function createUserAndSignIn(user) {
    await User.create(user);

    return await chaiRequest.signInUser(user);
}

async function logout() {
    return await chaiRequest.post('/logout');
}

async function createQuest() {
    return await chaiRequest.post('/api/quests', questData);
}

describe('controller:quest', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('required auth', () => {
        beforeEach(() => createUserAndSignIn(userMocks.UserWithCorrectPassword));

        describe('success with auth', () => {
            afterEach(() => logout());

            it('should create the quest', async () => {
                const res = await createQuest();

                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
                res.body.data.slug.should.equal(slugify(questData.title));
            });

            it('should PUT a quest', async () => {
                const slug = slugify(questData.title);
                const updateData = {
                    title: 'SomeOther',
                    description: 'SomeOtherDescription'
                };

                await createQuest();
                const res = await chaiRequest.put(`/api/quests/${slug}`, updateData);

                res.status.should.equal(HttpStatus.OK);
                res.body.data.title.should.equal(updateData.title);
                res.body.data.description.should.equal(updateData.description);
            });

            it('should delete a quest', async () => {
                const slug = slugify(questData.title);
                await createQuest();
                const res = await chaiRequest.delete(`/api/quests/${slug}`);

                res.status.should.equal(HttpStatus.OK);
            });
        });

        describe('fails without auth', () => {
            it('should not create the quest without auth', async () => {
                logout();

                try {
                    await createQuest();
                } catch (err) {
                    err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });

            it('should not put a quest without auth', async () => {
                const slug = slugify(questData.title);
                const updateData = {
                    title: 'SomeOther',
                    description: 'SomeOtherDescription'
                };

                await createQuest();
                await logout();

                try {
                    await chaiRequest.put(`/api/quests/${slug}`, updateData);
                } catch (err) {
                    err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });

            it('should not delete a quest without auth', async () => {
                const slug = slugify(questData.title);
                await createQuest();
                await logout();

                try {
                    await chaiRequest.delete(`/api/quests/${slug}`);
                } catch (err) {
                    err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });
        });
    });

    describe('not depended on auth', () => {
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

        it('should not found nonexistent quest', async () => {
            try {
                await chaiRequest.get(`/api/quests/some-bad-slug`);
            } catch (err) {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            }
        });
    });
});
