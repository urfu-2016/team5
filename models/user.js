<<<<<<< HEAD
'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    createdQuests: {
        type: [{type: ObjectId, ref: 'Quest'}],
        default: []
    },
    quests: {
        type: [{
            questId: {type: ObjectId, ref: 'Quest'},
            statuses: [Boolean]
        }],
        default: []
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
    create: ({firstname = '', surname = '', username}) => {
        const user = new UserModel({
            firstname,
            surname,
            username
        });

        return user.save();
    },

    update: (username, {firstname, surname}) => {
        return UserModel.findOne({username}).then(user => {
            user.firstname = firstname ? firstname : user.firstname;
            user.surname = surname ? surname : user.surname;

            return user.save();
        });
    },

    getAll: () => UserModel.find({}).exec(),

    getByUsername: username => UserModel.findOne({username}).exec(),

    removeByUsername: username => UserModel
        .findOne({username})
        .then(user => user.remove())
};
=======
'use strict';

const mongoose = require('../libs/mongoose-connection');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    username: {
        type: String,
        lowercase: true,
        index: true,
        unique: true,
        required: true
    },
    createdQuests: {
        type: [{type: ObjectId, ref: 'Quest'}],
        default: []
    },
    quests: {
        type: [{
            questId: {type: ObjectId, ref: 'Quest'},
            statuses: [Boolean]
        }],
        default: []
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
    create: ({firstname, surname, username}) => {
        const user = new UserModel({
            firstname,
            surname,
            username
        });

        return user.save();
    },

    update: (username, {firstname, surname}) => {
        return UserModel.findOne({username}).then(user => {
            user.firstname = firstname ? firstname : user.firstname;
            user.surname = surname ? surname : user.surname;

            return user.save();
        });
    },

    getAll: () => UserModel.find({}).exec(),

    getByUsername: username => UserModel
        .findOne({username})
        .exec(),

    removeByUsername: username => UserModel
        .findOne({username})
        .then(user => user.remove())
};
>>>>>>> Сделал ребейз + мелкие правки
