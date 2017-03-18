/* eslint-env mocha */
'use strict';

const questGenerator = require('../../scripts/generate-db-data');
require('chai').should();
const Quest = require('../../models/quest');
const clearDataBase = require('../../scripts/clear-db');

describe('scripts:generate-db-data', () => {
    beforeEach(() => {
        return clearDataBase();
    });

    after(() => {
        return clearDataBase();
    });

    it('data-generation', () => {
        const questsCount = 10;

        return questGenerator(questsCount)
            .then(() => {
                return Quest
                    .find({})
                    .exec();
            })
            .then(v => {
                v.length
                    .should.equal(questsCount);
            });
    });

    it('connection-to-base-is-alive', () => {
        const connectionAliveCode = 1;
        Quest.base.connections[0].readyState
            .should.equal(connectionAliveCode);
    });
});
