/* eslint-env mocha */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const slugify = require('slug');
const questsMocks = require('../mocks/quests');
const userMocks = require('../mocks/users');
const createQuestWithAuthor = require('../../scripts/generate-db-data').createQuestWithAuthor;
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const constants = require('../../constants/controllers');

const questData = questsMocks.regularQuest;
const questDataWithImage = questsMocks.questWithImages;

async function createQuest() {
    return await chaiRequest.post('/api/quests', questData);
}

async function createQuestWithImages() {
    return await chaiRequest.post('/api/quests', questDataWithImage);
}

describe('controller:quest', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    describe('required auth', () => {
        beforeEach(() => chaiRequest.createUserAndSignIn(userMocks.userWithCorrectPassword));

        describe('success with auth', () => {
            afterEach(() => chaiRequest.logout());

            it('should create the quest', async () => {
                const res = await createQuest();

                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
                res.body.data.slug.should.equal(slugify(questData.title));
                res.body.data.isMyQuest.should.equal(true);
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
                res.body.data.isMyQuest.should.equal(true);
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
                await chaiRequest.logout();

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
                await chaiRequest.logout();

                try {
                    await chaiRequest.put(`/api/quests/${slug}`, updateData);
                } catch (err) {
                    err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });

            it('should not delete a quest without auth', async () => {
                const slug = slugify(questData.title);
                await createQuest();
                await chaiRequest.logout();

                try {
                    await chaiRequest.delete(`/api/quests/${slug}`);
                } catch (err) {
                    err.response.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });
        });

        describe('user', () => {
            it('should can start unstarted quest', async () => {
                const quest = (await createQuest()).body.data;
                const res = await chaiRequest.post(`/api/quests/${quest.slug}/start`);

                res.status.should.equal(HttpStatus.OK);
            });

            it('should can\t start already started quest', async () => {
                const quest = (await createQuest()).body.data;
                await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                try {
                    await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                } catch (err) {
                    err.status.should.equal(HttpStatus.BAD_REQUEST);
                }
            });

            it('should get statuses of started quest', async () => {
                const quest = (await createQuestWithImages()).body.data;
                await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                const res = await chaiRequest.get(`/api/quests/${quest.slug}/photos`);
                res.body.data.length.should.equal(quest.images.length);
                (res.body.data[0].status === null).should.equal(true);
                (res.body.data[1].status === null).should.equal(true);
            });

            it('should can checkin', async () => {
                const quest = (await createQuestWithImages()).body.data;
                await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                const res = await chaiRequest.post(`/api/quests/${quest.slug}/photos/0/check`, {
                    lat: '1',
                    lon: '1'
                });
                res.body.status.should.equal(true);
                res.body.finished.should.equal(false);
            });

            it('should can\'t far checkin', async () => {
                const quest = (await createQuestWithImages()).body.data;
                await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                const res = await chaiRequest.post(`/api/quests/${quest.slug}/photos/0/check`, {
                    lat: '101',
                    lon: '101'
                });
                res.body.status.should.equal(false);
                res.body.finished.should.equal(false);
            });

            it('should can finish the quest', async () => {
                const quest = (await createQuestWithImages()).body.data;
                await chaiRequest.post(`/api/quests/${quest.slug}/start`);
                let res = await chaiRequest.post(`/api/quests/${quest.slug}/photos/0/check`, {
                    lat: '1',
                    lon: '1'
                });

                res.body.finished.should.equal(false);
                res = await chaiRequest.get(`/api/quests/${quest.slug}/photos`);
                res = await chaiRequest.post(`/api/quests/${quest.slug}/photos/1/check`, {
                    lat: '1',
                    lon: '1'
                });
                res.body.finished.should.equal(true);
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
            res.body.data[0].isMyQuest.should.equal(false);
        });

        it('should GET a quest by the given slug', async () => {
            const slug = slugify(questData.title);
            await createQuestWithAuthor(questData);
            const res = await chaiRequest.get(`/api/quests/${slug}`);

            res.status.should.equal(HttpStatus.OK);
            res.body.data.slug.should.equal(slug);
            res.body.data.isMyQuest.should.equal(false);
        });

        it('should not found nonexistent quest', async () => {
            try {
                await chaiRequest.get(`/api/quests/some-bad-slug`);
            } catch (err) {
                err.status.should.equal(HttpStatus.NOT_FOUND);
                err.response.text.should.equal(constants.quest.questNotFoundErrorMessage);
            }
        });
    });
});
