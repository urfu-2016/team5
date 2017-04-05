/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const slugify = require('slug');
const questsMocks = require('../mocks/quests');

chai.should();
chai.use(chaiHttp);

describe('controller:quest', () => {
    const questData = questsMocks.regularQuest;

    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should create the quest', () => {
        let quest = Object.assign({}, questData);

        return Quest._setAuthor(quest)
            .then(() => {
                return chai
                    .request(server)
                    .post('/api/quests')
                    .send(quest);
            })
            .then(res => {
                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
            });
    });

    it('should GET all the quests', () => {
        return Quest._createWithAuthor(questData)
            .then(() => Quest._createWithAuthor(questData))
            .then(() => {
                return chai.request(server)
                    .get('/api/quests')
                    .send();
            })
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.should.length.of.at(2);
            });
    });

    it('should GET a quest by the given slug', () => {
        const slug = slugify(questData.title);

        return Quest._createWithAuthor(questData)
            .then(() => {
                return chai.request(server)
                    .get(`/api/quests/${slug}`)
                    .send();
            })
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

        return Quest._createWithAuthor(questData)
            .then(() => {
                return chai.request(server)
                    .put(`/api/quests/${slug}`)
                    .send(updateData);
            })
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.title.should.equal(updateData.title);
                res.body.data.description.should.equal(updateData.description);
            });
    });

    it('should delete a quest', () => {
        const slug = slugify(questData.title);

        return Quest._createWithAuthor(questData)
            .then(() => {
                return chai
                    .request(server)
                    .delete(`/api/quests/${slug}`)
                    .send();
            })
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
            })
            .then(() => {
                return chai
                    .request(server)
                    .delete(`/api/quests/${slug}`)
                    .send();
            })
            .then(res => {
                // TUT
                console.log(res.status);
                res.status.should.equal(HttpStatus.OK);
            });
    });

    it('should answer with status 404', () => {
        return chai
            .request(server)
            .get(`/api/quests/some-bad-slug`)
            .send()
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
            });
    });
});
