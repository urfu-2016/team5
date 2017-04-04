'use strict';

const constants = require('../constants/mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = require('config').mongoUri;

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, constants.errorPrompt));
db.once('open', () => {});

module.exports = mongoose;
