'use strict';

const passport = require('passport');
const serialization = require('./passport/serialization/local');

passport.use(require('./passport/strategies/localStrategy'));

passport.serializeUser(serialization.serialize);
passport.deserializeUser(serialization.deserialize);

module.exports = passport;
