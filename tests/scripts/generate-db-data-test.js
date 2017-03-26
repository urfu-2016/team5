<<<<<<< HEAD
/* eslint-env mocha */
'use strict';

const questGenerator = require('../../scripts/generate-db-data');
require('chai').should();
require('../../models/quest');
const Quest = require('mongoose').model('Quest');
const dbClearer = require('../../scripts/clear-db');

describe('scripts:generate-db-data', () => {
    beforeEach(() => dbClearer.clearWholeDB());

    after(() => dbClearer.clearWholeDB());

    it('data-generation', () => {
        const questsCount = 10;

        return questGenerator(questsCount)
            .then(() => {
                return Quest
                    .find({})
                    .exec();
            })
            .then(quests => {
                quests[0].get('authorId')
                    .should.be.a('object');

                quests.length
                    .should.equal(questsCount);
            });
    });

    it('connection-to-base-is-alive', () => {
        const connectionAliveCode = 1;
        Quest.base.connections[0].readyState
            .should.equal(connectionAliveCode);
    });
});
=======
/* eslint-env mocha */
'use strict';

require('chai').should();
const fs = require('fs');
const path = require('path');
const dbClearer = require('../../scripts/clear-db');
const dbGenerator = require('../../scripts/generate-db-data');

function modelsCountShouldEqual(model, expectedCount) {
    return model.find({})
        .exec()
        .then(models => {
            models.length.should.equal(expectedCount);
        });
}

describe('scripts:generate-db-data:generateQuests', () => {
    const Quest = require('mongoose').model('Quest');

    beforeEach(() => dbClearer.removeAllQuests());

    after(() => dbClearer.removeAllQuests());

    it('should generate 10 quests by default', () => {
        const questsCount = 10;

        return dbGenerator.generateQuests({})
            .then(() => modelsCountShouldEqual(Quest, questsCount));
    });

    it('should generate needed quests count', () => {
        const questsCount = 11;

        return dbGenerator.generateQuests({questsCount})
            .then(() => modelsCountShouldEqual(Quest, questsCount));
    });

    it('should create models from json', () => {
        const questsCount = 3;
        const fileWithJson = path.join(__dirname, 'testQuests.json');

        return dbGenerator.createQuestsFromJson(fs.readFileSync(fileWithJson))
            .then(() => modelsCountShouldEqual(Quest, questsCount));
    });
});

describe('scripts:generate-db-data:generateUsers', () => {
    const User = require('mongoose').model('User');

    beforeEach(() => dbClearer.removeAllUsers());

    after(() => dbClearer.removeAllUsers());

    it('should generate 1 user by default', () => {
        const usersCount = 1;

        return dbGenerator.generateUsers({})
            .then(() => modelsCountShouldEqual(User, usersCount));
    });

    it('should generate needed users count', () => {
        const usersCount = 11;

        return dbGenerator.generateUsers({usersCount})
            .then(() => modelsCountShouldEqual(User, usersCount));
    });

    it('should create models from json', () => {
        const usersCount = 3;
        const fileWithJson = path.join(__dirname, 'testUsers.json');

        return dbGenerator.createUsersFromJson(fs.readFileSync(fileWithJson))
            .then(() => modelsCountShouldEqual(User, usersCount));
    });
});
>>>>>>> Рендеринг реальных сгенерированных данных
