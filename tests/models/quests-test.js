/* eslint-env mocha */

require('chai').should();
const mongoose = require('mongoose');
const Quest = require('../../models/quest');
const questsMocks = require('../mocks/quests');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

const title = 'Buga-ga';
const partTitle = 'b';
const description = 'Bla-bla';
const questName = 'Новый квест:)';
const nickname = 'user';
const author = new User({nickname});
const likes = [author];
const tags = ['Екатеринбург', 'Граффити'];

describe('models:Quest', () => {
    beforeEach(() => removeAllQuests());

    after(() => removeAllQuests());

    it('should create model', () => {
        const questData = questsMocks.regularQuest;

        return Quest.create(questData)
            .then(savedQuest => {
                savedQuest.title.should.equal(questData.title);
                savedQuest.description.should.equal(questData.description);
            });
    });

    it('error on save without required parameter', () => {
        const questData = questsMocks.questWithoutRequiredFields;
        const ValidationError = mongoose.Error.ValidationError;

        return Quest.create(questData)
            .catch(error => {
                error.name.should.equal(ValidationError.name);
            });
    });

    it('should generate slug, if not specified', () => {
        const questData = questsMocks.questWithoutSlug;

        return Quest.create(questData)
            .then(savedQuest => savedQuest.slug.should.not.empty);
    });

    it('should update by slug', () => {
        const questData = questsMocks.regularQuest;
        const city = 'Екатеринбург';

        return Quest.create(questData)
            .then(savedQuest => Quest.update(savedQuest.slug, {city}))
            .then(updatedQuest => updatedQuest.city.should.equal(city));
    });

    it('should get by slug', () => {
        const questData = questsMocks.regularQuest;

        return Quest.create(questData)
            .then(savedQuest => Quest.getBySlug(savedQuest.slug))
            .then(foundedQuest => foundedQuest.title.should.equal(questData.title));
    });

    it('should remove by slug', () => {
        const questData = questsMocks.regularQuest;

        return Quest.create(questData)
            .then(savedQuest => Quest.removeBySlug(savedQuest.slug))
            .then(() => Quest.getBySlug(questData.slug).should.empty);
    });

    it('should get filtered quests by title and tags', () => {
        const quest = new Quest({
            title,
            description,
            slug: questName,
            tags
        });
        const quest2 = new Quest({
            title: description,
            description,
            slug: title,
            tags: [title]
        });

        return quest
            .save()
            .then(() => {
                return quest2.save();
            })
            .then(() => {
                return Quest
                    .getFilteredQuests(['title', 'tags'], partTitle);
            })
            .then(quests => {
                console.log(quests);
                quests.length
                    .should.equal(2);

                quests[0].get('description')
                    .should.equal(description);
            });
    });

    it('should get filtered quests by tags', () => {
        const quest = new Quest({
            title,
            description,
            slug: questName,
            tags
        });

        return quest
            .save()
            .then(() => {
                return Quest
                    .getFilteredQuests(['tags'], tags[0]);
            })
            .then(quests => {
                quests.length
                    .should.equal(1);

                quests[0].get('title')
                    .should.equal(title);
            });
    });

    it('should get empty array', () => {
        const quest = new Quest({
            title,
            description,
            slug: questName,
            tags
        });

        return quest
            .save()
            .then(() => {
                return Quest
                    .getFilteredQuests(['tags'], description);
            })
            .then(quests => {
                quests.length
                    .should.equal(0);
            });
    });
});
