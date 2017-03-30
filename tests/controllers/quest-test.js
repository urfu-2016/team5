/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const questMocks = require('../mocks/quests');
const HttpStatus = require('http-status-codes');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;
const slugify = require('slug');

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
                res.body.data.slug.should.equal(slugify(questData.title));
            });
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
        const slug = slugify(questData.title);

        return Quest.create(questData)
            .then(() => chai.request(server)
                .get(`/api/quests/${slug}`)
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.slug.should.equal(slug);
                }));
    });

    it('should PUT a quest', () => {
        const questData = questMocks.regularQuest;
        const slug = slugify(questData.title);
        const updateData = {
            title: 'SomeOther',
            description: 'SomeOtherDescription'
        };

        return Quest.create(questData)
            .then(() => chai.request(server)
                .put(`/api/quests/${slug}`)
                .send(updateData)
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                    res.body.data.title.should.equal(updateData.title);
                    res.body.data.description.should.equal(updateData.description);
                }));
    });

    // Удаление не работает правильно. Должен ругаться на slug.
    it('should delete a quest', () => {
        const questData = questMocks.regularQuest;
        const slug = slugify(questData.title);

        return Quest.create(questData)
            .then(() => chai.request(server)
                .delete(`/api/quests/${slug}`)
                .send()
                .then(res => {
                    res.status.should.equal(HttpStatus.OK);
                }))
            .then(() => chai.request(server)
                .delete(`/api/quests/${slug}`)
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
