const mongoose = require('../libs/mongoose-connection');

const questSchema = new mongoose.Schema({
    title: String,
    description: String,
    slug: {
        type: String,
        index: {unique: true},
        required: true
    }
});
module.exports = mongoose.model('Quest', questSchema);
