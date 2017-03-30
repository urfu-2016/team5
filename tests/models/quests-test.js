<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Сделал ребейз + мелкие правки
/* eslint-env mocha */

require('chai').should();
const mongoose = require('mongoose');
const Quest = require('../../models/quest');
const questsMocks = require('../mocks/quests');
<<<<<<< HEAD
const dbClearer = require('../../scripts/clear-db');
const setAuthorAfterCreateUser = questsMocks.setAuthorAfterCreateUser;

describe('models:Quest', () => {
    let questData;

    beforeEach(() => {
        dbClearer.clearWholeDB();
        questData = Object.assign({}, questsMocks.regularQuest);
    });

    after(() => {
        dbClearer.clearWholeDB();
    });

    it('should create model', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
=======
const removeAllQuests = require('../../scripts/clear-db').removeAllQuests;

describe('models:Quest', () => {
    beforeEach(() => removeAllQuests());

    after(() => removeAllQuests());

    it('should create model', () => {
        const questData = questsMocks.regularQuest;

        return Quest.create(questData)
>>>>>>> Сделал ребейз + мелкие правки
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

<<<<<<< HEAD
    it('error on save without required author', () => {
        const questData = questsMocks.regularQuest;
        const ValidationError = mongoose.Error.ValidationError;

        return Quest.create(questData)
            .catch(error => error.name.should.equal(ValidationError.name));
    });

    it('should update by slug', () => {
        const city = 'Екатеринбург';

        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
=======
    it('should generate slug, if not specified', () => {
        const questData = questsMocks.questWithoutSlug;

        return Quest.create(questData)
            .then(savedQuest => savedQuest.slug.should.not.empty);
    });

    it('should update by slug', () => {
        const questData = questsMocks.regularQuest;
        const city = 'Екатеринбург';

        return Quest.create(questData)
>>>>>>> Сделал ребейз + мелкие правки
            .then(savedQuest => Quest.update(savedQuest.slug, {city}))
            .then(updatedQuest => updatedQuest.city.should.equal(city));
    });

    it('should get by slug', () => {
<<<<<<< HEAD
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(savedQuest => Quest.getBySlug(savedQuest.slug))
            .then(foundQuest => foundQuest.title.should.equal(questData.title));
    });

    it('should remove by slug', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(savedQuest => Quest.removeBySlug(savedQuest.slug))
            .then(() => Quest.getBySlug(questData.slug).should.empty);
    });

    it('should get filtered quests by title and tags', () => {
        const questPartTitle = questData.title[0];

        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(() => {
                questData.tags = questsMocks.questForSeatch.tags;
                questData.title = questsMocks.questForSeatch.title;

                return Quest.create(questData);
            })
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
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(() => Quest.searchByInternalProps(['tags'], questData.tags[0]))
            .then(quests => {
                quests.length
                    .should.equal(1);

                quests[0].get('title')
                    .should.equal(questData.title);
            });
    });

    it('should get empty array', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(() => {
                return Quest
                    .searchByInternalProps(['tags'], questData.description);
            })
            .then(quests => quests.length.should.equal(0));
    });

    it('should get quests by author', () => {
        return setAuthorAfterCreateUser(questData)
            .then(() => Quest.create(questData))
            .then(() => Quest.searchByAuthor(questData.author.username[0]))
            .then(quests => {
                quests.length
                    .should.equal(1);
                quests[0].authorId.username
                    .should.equal(questData.author.username);
            });
    });
});
=======
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
>>>>>>> Рендеринг реальных сгенерированных данных
=======
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
>>>>>>> Сделал ребейз + мелкие правки
