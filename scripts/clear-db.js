const User = require('../models/user');
const Quest = require('../models/quest');
const mongoose = require('mongoose');

module.exports = {
    removeAllQuests: () => Quest.remove({}),

    removeAllUsers: () => User.remove({}),

    async removeAll() {
        await User.remove({});
        await Quest.remove({});
    },

    dropAll() {
        return mongoose.connection.db.dropDatabase(err => {
            if (err) {
                console.log(err);
            }
        });
    }
};

