/* eslint-env mocha */
'use strict';

const questGenerator = require('../../scripts/generate-db-data');
const assert = require('assert');
const Quest = require('../../models/quest');

describe('scripts:generate-db-data', () => {
    afterEach(() => {
        return Quest
            .remove({})
            .exec();
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
                assert.equal(v.length, questsCount);
            });
    });

    it('connection-to-base-is-alive', () => {
        assert.equal(Quest.base.connections[0].readyState, 1);
    });
});
