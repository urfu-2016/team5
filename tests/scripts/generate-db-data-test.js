/* eslint-env mocha */
'use strict';

const questGenerator = require('../../scripts/generate-db-data');
require('chai').should();
const Quest = require('../../models/quest');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

describe('scripts:generate-db-data', () => {
    beforeEach(() => {
        return removeAllQuests();
    });

    after(() => {
        return removeAllQuests();
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
