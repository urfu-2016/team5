const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Quest = require('../../models/quest');

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

    it('should GET all the quests', () => {
        return chai
            .request(server)
            .get('/quests')
            .send()
            .then(res => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
            });
    });
    it('should Create the quest', () => {
        return chai
            .request(server)
            .post('/quests')
            .send({title, description})
            .then(res => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('quest');
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
                    .get('/quests/' + quest.id)
                    .send()
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.quest.should.have.property('_id').eql(quest.id);
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
                    .put('/quests/' + quest.id)
                    .send({title, description: putDescription})
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message')
                            .eql('Quest updated!');
                        res.body.quest.should.have.property('description')
                            .eql(putDescription);
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
                    .delete('/quests/' + quest.id)
                    .send()
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message')
                            .eql('Quest removed!');
                    });
            });
    });
});
