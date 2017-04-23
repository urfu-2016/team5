const session = require('./session');

module.exports = {
    staticPath: '',
    session: () => session({
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    })
};
