
/* eslint-env mocha */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const slugify = require('slug');
const questsMocks = require('../mocks/quests');
const setAuthor = require('../../scripts/generate-db-data').setAuthor;
const createQuestWithAuthor = require('../../scripts/generate-db-data').createQuestWithAuthor;
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);

describe('controller:quest', () => {
    const questData = questsMocks.regularQuest;

    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should create the quest', async () => {
        let quest = Object.assign({}, questData);
        await setAuthor(quest);

        const res = await chaiRequest.post('/api/quests', quest);

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

        await createQuestWithAuthor(questData);
        const res = await chaiRequest.put(`/api/quests/${slug}`, updateData);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.title.should.equal(updateData.title);
        res.body.data.description.should.equal(updateData.description);
    });

    it('should delete a quest', async () => {
        const slug = slugify(questData.title);

        await createQuestWithAuthor(questData);
        const res = await chaiRequest.delete(`/api/quests/${slug}`);

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
