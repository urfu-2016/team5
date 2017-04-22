'use strict';

const passport = require('passport');
const serialization = require('./serialization/local');

passport.use(require('./strategies/localStrategy'));

passport.serializeUser(serialization.serialize);
passport.deserializeUser(serialization.deserialize);

module.exports = passport;
