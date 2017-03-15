/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');
const assert = require('assert');

chai.use(chaiHttp);

const title = 'Buga-ga';
const description = 'Bla-bla';
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
            .send({title, description})
            .then(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body.data.title, title);
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
    it('should GET a quest by the given id', () => {
        const quest = new Quest({
            title,
            description
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .get(`/quests/${quest.id}`)
                    .send()
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.data._id, quest.id);
                    });
            });
    });
    it('should PUT a quest', () => {
        const quest = new Quest({
            title,
            description
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .put(`/quests/${quest.id}`)
                    .send({title, description: putDescription})
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
            description
        });
        return quest
            .save()
            .then(quest => {
                return chai
                    .request(server)
                    .delete(`/quests/${quest.id}`)
                    .send()
                    .then(res => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.message, 'Quest removed!');
                    });
            });
    });
});
