const session = require('../libs/express-session');
require('dotenv').config();

module.exports = {
    staticPath: '',
    email: {
        user: process.env.APP_EMAIL_LOGIN,
        password: process.env.APP_EMAIL_PASS,
        host: process.env.APP_EMAIL_HOST,
        ssl: true,
        port: 465
    },

    session: () => session({
        secret: 'Секретный секрет',
        resave: false,
        saveUninitialized: false
    })
};
