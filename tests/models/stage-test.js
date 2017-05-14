/* eslint-env mocha */

require('chai').should();
const Stage = require('../../models/stage');
const stageMocks = require('../mocks/stage');
const stageWithSrc = stageMocks.stageWithSrc;
const dbClearer = require('../../scripts/clear-db');

describe('models:Stage', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should add stage', async () => {
        const stage = await Stage.create(stageWithSrc);

        stage.title.should.equal(stageWithSrc.title);
        stage.description.should.equal(stageWithSrc.description);
        stage.location.should.equal(stageWithSrc.location);
        stage.src.should.equal(stageWithSrc.src);
    });

    it('should update stage', async () => {
        const stage = await Stage.create(stageWithSrc);
        const updatedStage = await Stage.update(stage.shortid, stageMocks.updatedStage);

        updatedStage.shortid.should.equal(stage.shortid);
        updatedStage.title.should.equal(stageMocks.updatedStage.title);
        updatedStage.description.should.equal(stageMocks.updatedStage.description);
        updatedStage.location.should.equal(stageMocks.updatedStage.location);
        updatedStage.src.should.equal(stageWithSrc.src);
    });

    it('should get a stage by id', async () => {
        const stage = await Stage.create(stageWithSrc);
        const foundStage = await Stage.getByShortId(stage.shortid);

        foundStage.shortid.should.equal(stage.shortid);
        foundStage.title.should.equal(stage.title);
    });
});
