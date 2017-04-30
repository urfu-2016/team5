const User = require('../models/user');
const Quest = require('../models/quest');
const Comment = require('../models/comment');
const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => Quest.remove({}),

    removeAllUsers: () => User.remove({}),

    removeAllComments: () => Comment.remove({}),

    async removeAll() {
        await this.removeAllUsers();
        await this.removeAllQuests();
        await this.removeAllComments();
    },

    dropAll() {
        return mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase();
        });
    }
};

