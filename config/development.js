module.exports = {
    port: 8080,
    mode: 'development',
    mongoUri: 'mongodb://localhost/quests-team5',
    passportSession: {
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    }
};
