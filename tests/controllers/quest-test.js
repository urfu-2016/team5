/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const assert = require('assert');

chai.use(chaiHttp);

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';
const slug = 'Novyj-kvest';
const putDescription = 'Kry-kry';

describe('controller:quest', () => {
    beforeEach(() => {
        return Quest
            .remove({})
            .exec();
    });

    it('should Create the quest', () => {
        return chai
            .request(server)
            .post('/quests')
            .send({title, description, slug: questName})
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body.data.title, title);
                assert.equal(res.body.data.slug, slug);
            });
    });
    it('should Create the quest with generate slug', () => {
        const quest = new Quest({
            title,
            description,
            slug
        });
        return quest
            .save()
            .then(() => {
                return chai
                    .request(server)
                    .post('/quests')
                    .send({title, description, slug: questName})
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.ok(res.body.data.slug.length > slug.length);
                        assert.ok(res.body.data.slug.indexOf(slug) === 0);
                    });
            });
    });
    it('should GET all the quests', () => {
        return chai
            .request(server)
            .get('/quests')
            .send()
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body.data.length, 0);
            });
    });
    it('should GET a quest by the given slug', () => {
        const quest = new Quest({
            title,
            description,
            slug
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .get(`/quests/${quest.slug}`)
                    .send()
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.data.slug, slug);
                    });
            });
    });
    it('should PUT a quest', () => {
        const quest = new Quest({
            title,
            description,
            slug
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .put(`/quests/${quest.slug}`)
                    .send({title, description: putDescription, slug})
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.message, 'Quest updated!');
                        assert.equal(res.body.data.description, putDescription);
                    });
            });
    });
    it('should delete a quest', () => {
        const quest = new Quest({
            title,
            description,
            slug
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .delete(`/quests/${quest.slug}`)
                    .send()
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.message, 'Quest removed!');
                    });
            });
    });
});
