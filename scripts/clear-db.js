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
        return mongoose.connection.db.dropDatabase(err => {
            if (err) {
                console.log(err);
            }
        });
    }
};

