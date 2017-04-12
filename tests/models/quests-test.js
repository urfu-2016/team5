/* eslint-env mocha */

require('chai').should();
const mongoose = require('mongoose');
const Quest = require('../../models/quest');
const User = require('../../models/user');
const questsMocks = require('../mocks/quests');
const dbClearer = require('../../scripts/clear-db');

describe('models:Quest', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should create model', () => {
        const questData = questsMocks.regularQuest;

        return Quest._createWithAuthor(questData)
            .then(savedQuest => {
                savedQuest.title.should.equal(questData.title);
                savedQuest.description.should.equal(questData.description);
            });
    });

    it('error on save without required parameter', () => {
        const questData = questsMocks.questWithoutRequiredFields;
        const ValidationError = mongoose.Error.ValidationError;

        return Quest._createWithAuthor(questData)
            .catch(error => error.name.should.equal(ValidationError.name));
    });

    it('error on save without required author', () => {
        const questData = questsMocks.regularQuest;
        const ValidationError = mongoose.Error.ValidationError;

        return Quest.create(questData)
            .catch(error => error.name.should.equal(ValidationError.name));
    });

    it('should update by slug', () => {
        const questData = questsMocks.regularQuest;
        const city = 'Екатеринбург';

        return Quest._createWithAuthor(questData)
            .then(savedQuest => Quest.update(savedQuest.slug, {city}))
            .then(updatedQuest => updatedQuest.city.should.equal(city));
    });

    it('should get by slug', () => {
        const questData = questsMocks.regularQuest;

        return Quest._createWithAuthor(questData)
            .then(savedQuest => Quest.getBySlug(savedQuest.slug))
            .then(foundQuest => foundQuest.title.should.equal(questData.title));
    });

    it('should remove by slug', () => {
        const questData = questsMocks.regularQuest;

        return Quest._createWithAuthor(questData)
            .then(savedQuest => Quest.removeBySlug(savedQuest.slug))
            .then(() => Quest.getBySlug(questData.slug).should.empty);
    });

    it('should get filtered quests by title and tags', () => {
        const questData = questsMocks.questForSearch;
        const questPartTitle = questData.title[0];

        return Promise.all([
            Quest._createWithAuthor(questData),
            Quest._createWithAuthor(questData)
        ])
            .then(() => {
                return Quest
                    .searchByInternalProps(['title', 'tags'], questPartTitle);
            })
            .then(quests => {
                quests.length
                    .should.equal(2);

                quests[0].get('description')
                    .should.equal(questData.description);
            });
    });

    it('should get filtered quests by tags', () => {
        const questData = questsMocks.questForSearch;

        return Quest._createWithAuthor(questData)
            .then(() => Quest.searchByInternalProps(['tags'], questData.tags[0]))
            .then(quests => {
                quests.length
                    .should.equal(1);

                quests[0].get('title')
                    .should.equal(questData.title);
            });
    });

    it('should get empty array', () => {
        const questData = questsMocks.questForSearch;

        return Quest._createWithAuthor(questData)
            .then(() => {
                return Quest
                    .searchByInternalProps(['tags'], questData.description);
            })
            .then(quests => quests.length.should.equal(0));
    });

    it('should get quests by author', () => {
        let questData = Object.assign({}, questsMocks.questForSearch);

        return Quest._setAuthor(questData)
            .then(() => Quest.create(questData))
            .then(() => User.getById(questData.authorId))
            .then(user => Quest.searchByAuthor(user.username[0]))
            .then(quests => {
                quests.length
                    .should.equal(1);
                quests[0].author._id.toString()
                    .should.be.equal(questData.authorId.toString());
            });
    });
});
