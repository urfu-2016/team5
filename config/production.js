'use strict';

const login = process.env.mongoLogin;
const password = process.env.mongoPass;
const uri = 'ds145359.mlab.com:45359/quests-team5';
const session = require('./session');

const sessionConfig = {
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
};

module.exports = {
    port: 80,
    mode: 'production',
    staticPath: '//team5.surge.sh',
    mongoUri: `mongodb://${login}:${password}@${uri}`,
    session: () => session(sessionConfig)
};
