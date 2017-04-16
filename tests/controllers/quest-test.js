
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

    it('should create the quest', () => {
        let quest = Object.assign({}, questData);

        return setAuthor(quest)
            .then(() => chaiRequest.post('/api/quests', quest))
            .then(res => {
                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
                res.body.data.slug.should.equal(slugify(questData.title));
            });
    });

    it('should GET all the quests', () => {
        return createQuestWithAuthor(questData)
            .then(() => createQuestWithAuthor(questData))
            .then(() => chaiRequest.get('/api/quests'))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.should.length.of.at(2);
            });
    });

    it('should GET a quest by the given slug', () => {
        const slug = slugify(questData.title);

        return createQuestWithAuthor(questData)
            .then(() => chaiRequest.get(`/api/quests/${slug}`))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.slug.should.equal(slug);
            });
    });

    it('should PUT a quest', () => {
        const slug = slugify(questData.title);
        const updateData = {
            title: 'SomeOther',
            description: 'SomeOtherDescription'
        };

        return createQuestWithAuthor(questData)
            .then(() => chaiRequest.put(`/api/quests/${slug}`, updateData))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.title.should.equal(updateData.title);
                res.body.data.description.should.equal(updateData.description);
            });
    });

    it('should delete a quest', () => {
        const slug = slugify(questData.title);

        return createQuestWithAuthor(questData)
            .then(() => chaiRequest.delete(`/api/quests/${slug}`))
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
            });
    });

    it('should answer with status 404', () => {
        return chaiRequest
            .get(`/api/quests/some-bad-slug`)
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            });
    });
});
