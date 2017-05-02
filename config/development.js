require('dotenv').config();
module.exports = {
    port: 8080,
    mode: 'development',
    mongoUri: 'mongodb://localhost/quests-team5',
    appEmailLogin: process.env.APP_EMAIL_LOGIN,
    appEmailPass: process.env.APP_EMAIL_PASS,
    appEmailHost: process.env.APP_EMAIL_HOST,
    appUrl: 'http://localhost:8080/'
};
