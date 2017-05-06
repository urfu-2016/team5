const User = require('../models/user');
const Quest = require('../models/quest');
const Comment = require('../models/comment');
const QueriesStorage = require('../models/queriesStorage');
const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => Quest.remove({}),

    removeAllUsers: () => User.remove({}),

    removeAllComments: () => Comment.remove({}),

    removeAllQueries: () => QueriesStorage.remove({}),

    async removeAll() {
        await this.removeAllUsers();
        await this.removeAllQuests();
        await this.removeAllComments();
        await this.removeAllQueries();
    },

    dropAll() {
        return mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase();
        });
    }
};
