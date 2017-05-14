'use strict';

const fs = require('fs');
const path = require('path');
const clearDb = require('./clear-db');
const generateDb = require('./generate-db-data');
const mongoose = require('../libs/mongoose-connection');

const consoleArgs = require('command-line-args')([
    {name: 'quests-file', type: String, defaultValue: path.join(__dirname, 'quests.json')}
]);

const questsJson = fs.readFileSync(consoleArgs['quests-file']);

async function main() {
    await clearDb.dropAll();

    await generateDb.createQuestsFromJson(questsJson);
    await mongoose.connection.close();
}

main();
