const session = require('../libs/express-session');

module.exports = {
    staticPath: '',
    appEmailLogin: process.env.APP_EMAIL_LOGIN,
    appEmailPass: process.env.APP_EMAIL_PASS,
    appEmailHost: process.env.APP_EMAIL_HOST,
    session: () => session({
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    })
};
