/* eslint-env mocha */

require('chai').should();
const Quest = require('../../models/quest');
const User = require('../../models/user');
const mongoose = require('mongoose');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

const title = 'Buga-ga';
const description = 'Bla-bla';
const questName = 'Новый квест:)';
const nickname = 'user';
const author = new User({nickname});
const likes = [author];
const tags = ['Екатеринбург', 'Граффити'];

describe('model:quest', () => {
    beforeEach(() => {
        return removeAllQuests();
    });

    after(() => {
        return removeAllQuests();
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
            likes,
            author,
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

        likes[0].should.equal(quest.get('likes')[0]);

        author.should.equal(quest.get('author'));
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
