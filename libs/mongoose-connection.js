const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('config');
const uri = config.mongoUri;

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

});

module.exports = mongoose;
