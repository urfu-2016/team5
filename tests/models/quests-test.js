/* global it, describe, beforeEach */

const assert = require('assert');
const Quest = require('../../models/quest');

const title = 'Buga-ga';
const description = 'Bla-bla';

describe('quest model', () => {
    beforeEach(() => {
        return Quest
            .remove({})
            .exec();
    });

    it('initialization', () => {
        const quest = new Quest({
            title,
            description
        });

        assert.equal(quest.get('title'), title);
        assert.equal(quest.get('description'), description);
    });

    it('save model', () => {
        const quest = new Quest({
            title,
            description
        });

        return quest
            .save()
            .then(() => {
                return Quest
                    .find({})
                    .exec();
            })
            .then(quests => {
                assert.equal(quests.length, 1);
                assert.equal(quests[0].get('title'), title);
            });
    });
});
