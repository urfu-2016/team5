'use strict';

const login = process.env.mongoLogin;
const password = process.env.mongoPass;
const uri = 'ds161400.mlab.com:61400/quests-team5-pr';

module.exports = {
    port: 80,
    mode: 'review',
    mongoUri: `mongodb://${login}:${password}@${uri}`
};
