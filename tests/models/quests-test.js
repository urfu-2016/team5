/* eslint-env mocha */

const assert = require('assert');
const Quest = require('../../models/quest');

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';

describe('model:quest', () => {
    beforeEach(() => {
        return Quest
            .remove({})
            .exec();
    });

    it('initialization', () => {
        const quest = new Quest({
            title,
            description,
            slug: questName
        });

        assert.equal(quest.get('title'), title);
        assert.equal(quest.get('description'), description);
    });

    it('save model', () => {
        const quest = new Quest({
            title,
            description,
            slug: questName
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
