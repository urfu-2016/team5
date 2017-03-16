/* eslint-env mocha */

require('chai').should();
const Quest = require('../../models/quest');
const mongoose = require('mongoose');
const clearDataBase = require('../../scripts/clear-db');
const Image = require('../../models/image');

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';

const src = '1';
const images = [new Image({src})];

const likesCount = 1;
const tags = ['Екатеринбург', 'Граффити'];

describe('model:quest', () => {
    beforeEach(() => {
        return clearDataBase();
    });

    after(() => {
        return clearDataBase();
    });

    after(() => {
        return Quest
            .remove({})
            .exec();
    });

    // Добавить тест на author
    it('initialization', () => {
        const dateOfCreation = new Date();
        const quest = new Quest({
            title,
            description,
            slug: questName,
            images,
            likesCount,
            tags,
            dateOfCreation
        });
        const image = {title: 'title'};
        quest.images.push(image);

        assert.equal(quest.get('title'), title);
        assert.equal(quest.get('description'), description);
        assert.equal(quest.get('images')[0].src, images[0].src);
        assert.equal(quest.get('images').length, images.length);
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

    it('error on save with required parameter', () => {
        const quest = new Quest({
            description
        });
    })
});
