
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = sessionConfig => {
    const mongoose = require('../libs/mongoose-connection');
    sessionConfig.store = new MongoStore({mongooseConnection: mongoose.connection});

    return session(sessionConfig);
};
