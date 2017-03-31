/* eslint-env mocha */

require('chai').should();
const mongoose = require('mongoose');
const Quest = require('../../models/quest');
const questsMocks = require('../mocks/quests');
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

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
});
