const mongoose = require('../libs/mongoose-connection');

const questSchema = mongoose.Schema({
    title: String,
    description: String
});

module.exports = mongoose.model('Quest', questSchema);
