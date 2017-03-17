/* eslint-env mocha */

require('chai').should();
const Quest = require('../../models/quest');
const mongoose = require('mongoose');
const clearDataBase = require('../../scripts/clear-db');

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';
const likesCount = 1;
const tags = ['Екатеринбург', 'Граффити'];

describe('model:quest', () => {
    beforeEach(() => {
        return clearDataBase();
    });

    after(() => {
        return clearDataBase();
    });

    it('initialization', () => {
        const dateOfCreation = new Date();
        const quest = new Quest({
            title,
            description,
            slug: questName,
            likesCount,
            tags,
            dateOfCreation
        });
        const image = {title: 'title'};
        quest.images.push(image);

        assert.equal(quest.get('title'), title);
        assert.equal(quest.get('description'), description);
        assert.equal(quest.get('images')[0].title, image.title);
        assert.equal(quest.get('images').length, 1);
        assert.equal(quest.get('likesCount'), likesCount);
        assert.deepEqual(quest.get('tags')[0], tags[0]);
        assert.equal(quest.get('tags').length, tags.length);

        const date = quest.get('dateOfCreation');
        assert.equal(date.getFullYear(), dateOfCreation.getFullYear());
        assert.equal(date.getMonth(), dateOfCreation.getMonth());
        assert.equal(date.getDay(), dateOfCreation.getDay());
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

    it('error on save without required parameter', () => {
        const ValidationError = mongoose.Error.ValidationError;

        return new Quest({})
            .save()
            .catch(error => {
                assert.equal(error.name, ValidationError.name);
            });
    });
});
