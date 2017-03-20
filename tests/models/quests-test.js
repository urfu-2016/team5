/* eslint-env mocha */

require('chai').should();
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

        quest.get('title').should.equal(title);
        quest.get('description').should.equal(description);
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
                quests.should.have.lengthOf(1);
                quests[0].get('title').should.equal(title);
            });
    });
});
