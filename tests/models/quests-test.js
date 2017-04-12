/* eslint-env mocha */

// test

require('chai').should();
const mongoose = require('mongoose');
const Quest = require('../../models/quest');
const User = require('../../models/user');
const questsMocks = require('../mocks/quests');
const dbClearer = require('../../scripts/clear-db');
const setAuthor = require('../../scripts/generate-db-data').setAuthor;
const createQuestWithAuthor = require('../../scripts/generate-db-data').createQuestWithAuthor;
const QueryBuilder = require('../../libs/queryBuilder');

async function searchQuests(requestBody) {
    const buildData = await (new QueryBuilder())
        .applyFilters(requestBody)
        .build();

    return await Quest.search(buildData);
}

describe('models:Quest', () => {
    beforeEach(() => dbClearer.removeAll());

    after(() => dbClearer.removeAll());

    it('should create model', async () => {
        const questData = questsMocks.regularQuest;

        const savedQuest = await createQuestWithAuthor(questData);

        savedQuest.title.should.equal(questData.title);
        savedQuest.description.should.equal(questData.description);
    });

    it('error on save without required parameter', async () => {
        const questData = questsMocks.questWithoutRequiredFields;
        const ValidationError = mongoose.Error.ValidationError;

        try {
            await createQuestWithAuthor(questData);
        } catch (err) {
            err.name.should.equal(ValidationError.name);
        }
    });

    it('error on save without required author', async () => {
        const questData = questsMocks.regularQuest;
        const ValidationError = mongoose.Error.ValidationError;

        try {
            await Quest.create(questData);
        } catch (err) {
            err.name.should.equal(ValidationError.name);
        }
    });

    it('should update by slug', async () => {
        const questData = questsMocks.regularQuest;
        const city = 'Екатеринбург';

        const savedQuest = await createQuestWithAuthor(questData);
        const updatedQuest = await Quest.update(savedQuest.slug, {city});

        updatedQuest.city.should.equal(city);
    });

    it('should get by slug', async () => {
        const questData = questsMocks.regularQuest;

        const savedQuest = await createQuestWithAuthor(questData);
        const foundQuest = await Quest.getBySlug(savedQuest.slug);

        foundQuest.title.should.equal(questData.title);
    });

    it('should remove by slug', async () => {
        const questData = questsMocks.regularQuest;

        const savedQuest = await createQuestWithAuthor(questData);
        await Quest.removeBySlug(savedQuest.slug);
        const res = await Quest.getBySlug(questData.slug);

        (res === null).should.be.equal(true);
    });

    it('should get filtered quests by title', async () => {
        const questData = questsMocks.questForSearch;
        const requestBody = Object.assign({}, questsMocks.requestBody);
        requestBody.search.text = questData.title[0];

        await createQuestWithAuthor(questData);
        await createQuestWithAuthor(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(2);
        quests[0].description.should.equal(questData.description);
    });

    it('should get filtered quests by tags', async () => {
        const questData = questsMocks.questForSearch;
        const requestBody = Object.assign({}, questsMocks.requestBody);
        requestBody.search.text = questData.tags[0];
        requestBody.search.field = 'tags';

        await createQuestWithAuthor(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
        quests[0].title.should.equal(questData.title);
    });

    it('should get empty array', async () => {
        const questData = questsMocks.questForSearch;
        const requestBody = Object.assign({}, questsMocks.requestBody);
        requestBody.search.text = questData.description;

        await createQuestWithAuthor(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(0);
    });

    it('should get quests by author', async () => {
        const questData = Object.assign({}, questsMocks.questForSearch);
        const requestBody = questsMocks.requestBody;
        requestBody.search.field = 'author';

        await setAuthor(questData);
        await Quest.create(questData);
        const user = await User.getById(questData.authorId);
        requestBody.search.text = user.username[0];
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
        quests[0].author.should.deep.equal(questData.authorId);
    });

    it('should get quests by city', async () => {
        const questData = Object.assign({}, questsMocks.questForSearch);
        const requestBody = questsMocks.requestBody;
        requestBody.city = questData.city[0];

        await setAuthor(questData);
        await Quest.create(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
        quests[0].city.should.equal(questData.city);
    });

    it('should get quests by images count', async () => {
        const questData = Object.assign({}, questsMocks.questForSearch);
        const requestBody = questsMocks.requestBody;

        await setAuthor(questData);
        await Quest.create(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
        quests[0].images.length.should.equal(0);
    });

    it('should get quests by likes count', async () => {
        const questData = Object.assign({}, questsMocks.questForSearch);
        const requestBody = questsMocks.requestBody;

        await setAuthor(questData);
        await Quest.create(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
        quests[0].likes.length.should.equal(0);
    });

    it('should get quests by default request', async () => {
        const questData = Object.assign({}, questsMocks.questForSearch);
        const requestBody = questsMocks.requestBody;
        requestBody.search.field = '';
        requestBody.search.text = questData.city[0];

        await setAuthor(questData);
        await Quest.create(questData);
        const quests = await searchQuests(requestBody);

        quests.length.should.equal(1);
    });
});
