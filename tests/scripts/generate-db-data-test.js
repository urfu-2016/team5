/* eslint-env mocha */
'use strict';

const questGenerator = require('../../scripts/generate-db-data');
require('chai').should();
require('../../models/quest');
const Quest = require('mongoose').model('Quest');
const dbClearer = require('../../scripts/clear-db');

describe('scripts:generate-db-data', () => {
    beforeEach(() => {
        return dbClearer.removeAllQuests();
    });

    after(() => {
        return dbClearer.removeAllQuests();
    });

    it('data-generation', () => {
        const questsCount = 10;

        return questGenerator(questsCount)
            .then(() => {
                return Quest
                    .find({})
                    .exec();
            })
            .then(quests => {
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
