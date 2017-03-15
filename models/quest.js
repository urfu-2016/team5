const mongoose = require('../libs/mongoose-connection');

const questSchema = new mongoose.Schema({
    title: String,
    description: String
});
// , { _id: false }
module.exports = mongoose.model('Quest', questSchema);
