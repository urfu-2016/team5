/* eslint-env mocha */

require('chai').should();
const Quest = require('../../models/quest');
const mongoose = require('mongoose');
const clearDataBase = require('../../scripts/clear-db');

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';
// const likes = [new ];
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
            // likesCount,
            tags,
            dateOfCreation
        });

        const image = {title: 'title'};
        quest.images.push(image);

        title.should.equal(quest.get('title'));
        description.should.equal(quest.get('description'));
        image.title
            .should.equal(quest.get('images')[0].title);

        quest.get('images').length
            .should.equal(1);

        // likesCount.should.equal(quest.get('likesCount'));
        tags[0].should.equal(quest.get('tags')[0]);
        tags.length
            .should.equal(quest.get('tags').length);

        const date = quest.get('dateOfCreation');
        date.getFullYear()
            .should.equal(dateOfCreation.getFullYear());

        date.getMonth()
            .should.equal(dateOfCreation.getMonth());

        date.getDay()
            .should.equal(dateOfCreation.getDay());
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
                quests.length
                    .should.equal(1);

                quests[0].get('title')
                    .should.equal(title);
            });
    });

    it('error on save without required parameter', () => {
        const ValidationError = mongoose.Error.ValidationError;

        return new Quest({})
            .save()
            .catch(error => {
                error.name
                    .should.equal(ValidationError.name);
            });
    });
});
