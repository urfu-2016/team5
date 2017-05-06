const session = require('../libs/express-session');

module.exports = {
    staticPath: '',
    session: () => session({
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    }),
    currentDir: `${__dirname}/../`
};
