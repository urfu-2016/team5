'use strict';

require('dotenv').config();
const login = process.env.mongoLogin;
const password = process.env.mongoPass;
const uri = 'ds161400.mlab.com:61400/quests-team5-pr';

module.exports = {
    port: 80,
    mode: 'review',
    mongoUri: `mongodb://${login}:${password}@${uri}`,
    appEmailLogin: process.env.APP_EMAIL_LOGIN,
    appEmailPass: process.env.APP_EMAIL_PASS,
    appEmailHost: process.env.APP_EMAIL_HOST,
    appUrl: process.env.URL
};
