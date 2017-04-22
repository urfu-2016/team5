'use strict';

const fs = require('fs');
const path = require('path');
const clearDb = require('./clear-db');
const generateDb = require('./generate-db-data');
const mongoose = require('../libs/mongoose-connection');

const consoleArgs = require('command-line-args')([
    {name: 'users-count', alias: 'u', type: Number, defaultValue: 1},
    {name: 'quests-count', alias: 'q', type: Number, defaultValue: 10},
    {name: 'need-remove', alias: 'r', type: Boolean, defaultValue: true},
    {name: 'users-file', type: String, defaultValue: path.join(__dirname, '../mocks/users.json')},
    {name: 'quests-file', type: String, defaultValue: path.join(__dirname, '../mocks/quests.json')}
]);

const questsJson = fs.readFileSync(consoleArgs['quests-file']);
const usersJson = fs.readFileSync(consoleArgs['users-file']);
const questsCount = consoleArgs['quests-count'];
const usersCount = consoleArgs['users-count'];
const needRemove = consoleArgs['need-remove'];

async function main() {
    if (needRemove) {
        await clearDb.dropAll();
    }

    await generateDb.createQuestsFromJson(questsJson);
    await generateDb.createUsersFromJson(usersJson);
    await generateDb.generateQuests(questsCount);
    await generateDb.generateUsers(usersCount);

    await mongoose.connection.close();
}

main();
