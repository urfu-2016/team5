const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const config = require('../config/production');
const login = process.env.mongoLogin;

console.log(login);

mongoose.connect(
    'mongodb://<dbuser>:<dbpassword>@ds145359.mlab.com:45359/quests-team5'
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

});

module.exports = mongoose;
