const session = require('../libs/express-session');
require('dotenv').config();

module.exports = {
    staticPath: '',
    appUrl: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`,
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
    }),

    cloudinary: {
        name: process.env.CLOUDINARY_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    }
};
