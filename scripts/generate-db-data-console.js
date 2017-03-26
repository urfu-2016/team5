'use strict';

const fs = require('fs');
const path = require('path');
const clearDb = require('./clear-db');
const generateDb = require('./generate-db-data');
const consoleArgs = require('command-line-args')([
    {name: 'users-count', alias: 'u', type: Number, defaultValue: 1},
    {name: 'quests-count', alias: 'q', type: Number, defaultValue: 10},
    {name: 'users-file', type: String, defaultValue: path.join(__dirname, '../mocks/users.json')},
    {name: 'quests-file', type: String, defaultValue: path.join(__dirname, '../mocks/quests.json')}
]);

const questsJson = fs.readFileSync(consoleArgs['quests-file']);
const usersJson = fs.readFileSync(consoleArgs['users-file']);
const questsCount = consoleArgs['quests-count'];
const usersCount = consoleArgs['users-count'];

clearDb.removeAll()
    .then(() => Promise.all([
        generateDb.createQuestsFromJson(questsJson),
        generateDb.createUsersFromJson(usersJson),
        generateDb.generateQuests(questsCount),
        generateDb.generateUsers(usersCount)
    ]))
    .then(() => {
        require('../models/user').db.close();
        require('../models/quest').db.close();
        require('../models/account').db.close();
    })
    .then(() => process.exit());
