const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const uri = require('config').mongoUri;

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});

module.exports = mongoose;
