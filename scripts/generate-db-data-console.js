'use strict';

const defaultCount = 10;
const count = process.argv[2] ? parseInt(process.argv[2], 10) : defaultCount;

require('./generate-db-data')(count)
    .then(v => {
        const Quest = require('../models/quest');
        Quest.db.close();
    })
