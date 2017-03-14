const mongoose = require('../libs/mongoose-connection');

const questSchema = new mongoose.Schema({
    title: String,
    description: String
});

module.exports = mongoose.model('Quest', questSchema);
