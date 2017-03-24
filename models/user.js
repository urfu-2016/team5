const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    nickname: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true
    },
    createdQ: [{type: ObjectId, ref: 'Quest'}],
    quests: [{
        questId: {type: ObjectId, ref: 'Quest'},
        statuses: [Boolean]
    }]
});

module.exports = mongoose.model('User', userSchema);
