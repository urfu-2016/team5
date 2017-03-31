/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const questMocks = require('../mocks/quests');
const HttpStatus = require('http-status-codes');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

chai.should();
chai.use(chaiHttp);

describe('controller:quest', () => {
    beforeEach(() => removeAllQuests());

    after(() => removeAllQuests());

    it('should Create the quest', () => {
        const questData = questMocks.regularQuest;

        return chai
            .request(server)
            .post('/api/quests')
            .send(questData)
            .then(res => {
                res.status.should.equal(HttpStatus.CREATED);
                res.body.data.title.should.equal(questData.title);
                res.body.data.slug.should.equal(questData.slug);
            });
    });
  
    it('should create the quest with generate slug', () => {
        const questData = questMocks.questWithoutSlug;

        return chai.request(server)
            .post('/api/quests')
            .send(questData)
            .then(res => res.body.data.slug.should.not.empty);
    });

    it('should GET all the quests', () => {
        const questData = questMocks.regularQuest;

        return Quest.create(questData)
            .then(() => chai.request(server)
                .get('/api/quests')
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.should.length.of.at(1);
                }));
    });

    it('should GET a quest by the given slug', () => {
        const questData = questMocks.regularQuest;

        return Quest.create(questData)
            .then(() => chai.request(server)
                .get(`/api/quests/${questData.slug}`)
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.slug.should.equal(questData.slug);
                }));
    });

    it('should PUT a quest', () => {
        const questData = questMocks.regularQuest;
        const updateData = {
            title: 'SomeOther',
            description: 'SomeOtherDescription',
            slug: questData.slug
        };

        return Quest.create(questData)
            .then(() => chai.request(server)
                .put(`/api/quests/${questData.slug}`)
                .send(updateData)
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.title.should.equal(updateData.title);
                    res.body.data.description.should.equal(updateData.description);
                }));
    });

    it('should delete a quest', () => {
        const questData = questMocks.regularQuest;

        return Quest.create(questData)
            .then(() => chai.request(server)
                .delete(`/api/quests/${questData.slug}`)
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                }))
            .then(() => chai.request(server)
                .delete(`/api/quests/${questData.slug}`)
                .send()
                .catch(err => {
                    err.status.should.equal(HttpStatus.NOT_FOUND);
                }));
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
