/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const HttpStatus = require('http-status-codes');
// test string

chai.use(chaiHttp);
chai.should();

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
                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(title);
                res.body.data.slug.should.equal(slug);
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
                        res.status.should.equal(HttpStatus.CREATED);
                        res.body.data.slug.length.should.be.least(slug.length);
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
                        res.status.should.equal(HttpStatus.OK);
                        res.body.data.should.length.of.at(1);
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
                        res.status.should.equal(HttpStatus.OK);
                        res.body.data.slug.should.equal(slug);
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
                        res.status.should.equal(HttpStatus.OK);
                        res.body.data.description.should.equal(putDescription);
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
                        res.status.should.equal(HttpStatus.OK);
                    });
            })
            .then(() => {
                return chai
                    .request(server)
                    .delete(`/api/quests/${quest.slug}`)
                    .send()
                    .catch(err => {
                        err.status.should.equal(HttpStatus.NOT_FOUND);
                    });
            });
    });

    it('should answer with status 404', () => {
        return chai
            .request(server)
            .get(`/api/quests/${slug}`)
            .send()
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            });
    });
});
