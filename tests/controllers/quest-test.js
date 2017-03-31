/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const User = require('../../models/user');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const slugify = require('slug');
const questsMocks = require('../mocks/quests');
const setAuthorAfterCreateUser = questsMocks.setAuthorAfterCreateUser;

chai.should();
chai.use(chaiHttp);

describe('controller:quest', () => {
    let questData;

    beforeEach(() => {
        dbClearer.removeAllUsers();
        dbClearer.removeAllQuests();
        questData = Object.assign({}, questsMocks.regularQuest);
    });

    after(() => {
        dbClearer.removeAllQuests();
        dbClearer.removeAllUsers();
    });

    it('should Create the quest', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => {
                return chai
                    .request(server)
                    .post('/api/quests')
                    .send(questData);
            })
            .then(res => {
                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
                res.body.data.slug.should.equal(slugify(questData.title));
            });
    });

    it('should GET all the quests', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(() => {
                return chai.request(server)
                    .get('/api/quests')
                    .send();
            })
            .then(res => {
                res.status.should.equal(HttpStatus.OK);
                res.body.data.should.length.of.at(1);
            });
    });

    it('should GET a quest by the given slug', () => {
        const slug = slugify(questData.title);

        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
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

        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
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

        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
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
            .catch(err => {
                err.status.should.equal(HttpStatus.NOT_FOUND);
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
