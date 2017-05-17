/* eslint-env mocha */
/* eslint camelcase: ["error", {properties: "never"}] */

const server = require('../../app');
const HttpStatus = require('http-status-codes');
const dbClearer = require('../../scripts/clear-db');
const userMocks = require('../mocks/users');
const questMocks = require('../mocks/quests');
const stageMocks = require('../mocks/stage');
const Quest = require('../../models/quest');
const chaiRequest = require('../commonTestLogic/chaiRequest')(server);
const nock = require('nock');
const config = require('config');
const cloudinaryUrl = `https://api.cloudinary.com/v1_1`;

function getFilePath(fileName) {
    return `${__dirname}/../mocks/images/${fileName}`;
}

function addStage(questSlug, data) {
    const filePath = getFilePath('krya.jpg');
    const url = `/api/quests/${questSlug}/stages`;

    return chaiRequest.sendFormData(url, data, filePath);
}

function mockUpload(replyData, replyCount = 1) {
    return nock(cloudinaryUrl)
        .post(`/${config.cloudinary.name}/image/upload`)
        .times(replyCount)
        .reply(200, replyData);
}

function mockDelete() {
    return nock(cloudinaryUrl)
        .post(`/${config.cloudinary.name}/image/destroy`)
        .reply(200, {
            result: 'ok'
        });
}

describe('controller:stage', () => {
    let quest;
    this.skip();

    beforeEach(async () => {
        await dbClearer.removeAll();
        await chaiRequest.createUserAndSignIn(userMocks.userWithCorrectPassword);
        const questData = questMocks.regularQuest;
        quest = (await chaiRequest.post('/api/quests', questData)).body.data;
    });

    after(() => dbClearer.removeAll());

    describe('success with auth', () => {
        afterEach(() => chaiRequest.logout());

        it('should add the stage', async () => {
            const uploadNock = mockUpload({public_id: 'testId', url: 'testUrl'});

            const res = await addStage(quest.slug, stageMocks.stage);

            res.status.should.equal(HttpStatus.OK);
            res.body.data.src.length.should.not.equal(0);
            res.body.data.location.lat.should.equal(stageMocks.stage.lat);
            res.body.data.description.should.equal(stageMocks.stage.description);
            res.body.data.title.should.equal(stageMocks.stage.title);
            uploadNock.done();
        });

        it('should update the stage', async () => {
            const uploadNock = mockUpload({public_id: 'testId', url: 'testUrl'});
            const deleteNock = mockDelete();
            const newUploadNock = mockUpload({public_id: 'newTestId', url: 'newTestUrl'});
            const image = (await addStage(quest.slug, stageMocks.stage)).body.data;
            const url = `/api/quests/${quest.slug}/stages/${image.shortid}`;
            const newFilePath = getFilePath('newKrya.jpg');
            const sendData = stageMocks.updatedStage;
            const res = await chaiRequest.putFormData(url, sendData, newFilePath);

            res.status.should.equal(HttpStatus.OK);
            res.body.data.src.should.not.equal(image.src);
            res.body.data.shortid.should.equal(image.shortid);
            res.body.data.location.lat.should.equal(sendData.lat);
            res.body.data.description.should.equal(sendData.description);
            res.body.data.title.should.equal(sendData.title);
            uploadNock.done();
            deleteNock.done();
            newUploadNock.done();
        });

        it('should delete a stage', async () => {
            const uploadNock = mockUpload({public_id: 'testId', url: 'testUrl'});
            const deleteNock = mockDelete();
            const image = (await addStage(quest.slug, stageMocks.stage)).body.data;
            let currentQuest = await Quest.getBySlug(quest.slug);
            let stages = await currentQuest.getStages();
            stages.length.should.equal(1);

            const res = await chaiRequest.delete(`/api/quests/${quest.slug}/stages/${image.shortid}`);
            currentQuest = await Quest.getBySlug(quest.slug);
            stages = await currentQuest.getStages();
            stages.length.should.equal(0);

            res.status.should.equal(HttpStatus.OK);
            uploadNock.done();
            deleteNock.done();
        });
    });

    it('should GET all the stages by quest', async () => {
        const uploadNock = mockUpload({public_id: 'testId', url: 'testUrl'}, 3);
        await addStage(quest.slug, stageMocks.stage);
        await addStage(quest.slug, stageMocks.stage);
        await addStage(quest.slug, stageMocks.stage);
        const res = await chaiRequest.get(`/api/quests/${quest.slug}/stages`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.should.length.of.at(3);
        res.body.data[0].title.should.equal(stageMocks.stage.title);
        uploadNock.done();
    });

    it('should GET a stage by id', async () => {
        const uploadNock = mockUpload({public_id: 'testId', url: 'testUrl'});
        const stage = (await addStage(quest.slug, stageMocks.stage)).body.data;
        const res = await chaiRequest.get(`/api/stages/${stage.shortid}`);

        res.status.should.equal(HttpStatus.OK);
        res.body.data.title.should.equal(stageMocks.stage.title);
        uploadNock.done();
    });
});
