const session = require('../libs/express-session');
require('dotenv').config();

module.exports = {
    staticPath: '',
    email: {
        login: process.env.APP_EMAIL_LOGIN,
        pass: process.env.APP_EMAIL_PASS,
        host: process.env.APP_EMAIL_HOST
    },
    session: () => session({
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    })
};
