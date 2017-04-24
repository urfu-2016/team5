const User = require('../models/user');
const Quest = require('../models/quest');
const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => Quest.remove({}),

    removeAllUsers: () => User.remove({}),

    async removeAll() {
        await this.removeAllUsers();
        await this.removeAllQuests();
    },

    dropAll() {
        return mongoose.connection.once('connected', () => {
            mongoose.connection.db.dropDatabase();
        });
    }
};

