'use strict';

const Quest = require('../models/quest');
const defaultCount = 10;
const quests = [];

let count = parseInt(process.argv[2]);
if (!count) {
    count = defaultCount;
}
for (let i = 0; i < count; i++) {
    let quest = new Quest({title: 'Заголовок ' + i, description: 'Описание ' + i});
    let savePromise = quest.save();
    quests.push(savePromise);
}

Promise
    .all(quests)
    .then(() => {process.exit(0);});
