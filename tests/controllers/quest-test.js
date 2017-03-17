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
            .post('/api/quests')
            .send({title, description, slug: questName})
            .then(res => {
                assert.equal(res.status, 201);
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
                    .post('/api/quests')
                    .send({title, description, slug: questName})
                    .then(res => {
                        assert.equal(res.status, 201);
                        assert.ok(res.body.data.slug.length >= slug.length);
                    });
            });
    });
    it('should GET all the quests', () => {
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
                .get('/api/quests')
                .send()
                .then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.data.length, 1);
                });
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
                    .get(`/api/quests/${quest.slug}`)
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
                    .put(`/api/quests/${quest.slug}`)
                    .send({title, description: putDescription, slug})
                    .then(res => {
                        assert.equal(res.status, 200);
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
                    .delete(`/api/quests/${quest.slug}`)
                    .send()
                    .then(res => {
                        assert.equal(res.status, 200);
                    });
            })
            .then(() => {
                return chai
                    .request(server)
                    .delete(`/api/quests/${quest.slug}`)
                    .send()
                    .catch(res => {
                        assert.equal(res.status, 404);
                    });
            });
    });

    it('should answer with status 404', () => {
        return chai
            .request(server)
            .get(`/api/quests/${slug}`)
            .send()
            .catch(err => {
                assert.equal(err.status, 404);
            });
    });
});
