/* eslint-env mocha */
'use strict';

require('chai').should();
const fs = require('fs');
const path = require('path');
const dbClearer = require('../../scripts/clear-db');
const dbGenerator = require('../../scripts/generate-db-data');

async function modelsCountShouldEqual(model, expectedCount) {
    const models = await model.find({}).exec();

    models.length.should.be.equal(expectedCount);
}

describe('scripts:generate-db-data:generateQuests', () => {
    const Quest = require('mongoose').model('Quest');

    beforeEach(() => dbClearer.removeAllQuests());

    after(() => dbClearer.removeAllQuests());

    it('should generate 10 quests by default', async () => {
        const questsCount = 10;

        await dbGenerator.generateQuests({});

        await modelsCountShouldEqual(Quest, questsCount);
    });

    it('should generate needed quests count', async () => {
        const questsCount = 11;

        await dbGenerator.generateQuests({questsCount});

        await modelsCountShouldEqual(Quest, questsCount);
    });

    it('should create models from json', async () => {
        const questsCount = 3;
        const fileWithJson = path.join(__dirname, 'testQuests.json');

        await dbGenerator.createQuestsFromJson(fs.readFileSync(fileWithJson));

        await modelsCountShouldEqual(Quest, questsCount);
    });
});

describe('scripts:generate-db-data:generateUsers', () => {
    const User = require('mongoose').model('User');

    beforeEach(() => dbClearer.removeAllUsers());

    after(() => dbClearer.removeAllUsers());

    it('should generate 1 user by default', async () => {
        const usersCount = 1;

        await dbGenerator.generateUsers({});

        await modelsCountShouldEqual(User, usersCount);
    });

    it('should generate needed users count', async () => {
        const usersCount = 11;

        await dbGenerator.generateUsers({usersCount});

        await modelsCountShouldEqual(User, usersCount);
    });

    it('should create models from json', async () => {
        const usersCount = 3;
        const fileWithJson = path.join(__dirname, 'testUsers.json');

        await dbGenerator.createUsersFromJson(fs.readFileSync(fileWithJson));

        await modelsCountShouldEqual(User, usersCount);
    });
});
