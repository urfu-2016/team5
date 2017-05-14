'use strict';

const User = require('../models/user');
const Quest = require('../models/quest');
const constants = require('../constants/generation');
const shortid = require('shortid');

const createdUsers = [];

function createAll(model, allData) {
    return Promise.all(
        allData.map(data => model.create(data))
    );
}

function generateUsers(usersCount) {
    if (usersCount < createdUsers.length) {
        return createdUsers.slice(0, usersCount);
    }
    const users = [];

    for (let i = 0; i < usersCount; i++) {
        let userData = {
            firstname: `${constants.user.firstnamePrefix}`,
            surname: `${constants.user.surnamePrefix}`,
            username: 'User_' + shortid.generate(),
            email: shortid.generate() + constants.user.email,
            password: constants.user.password
        };

        users.push(userData);
    }

    return createAll(User, users);
}

module.exports.createQuestsFromJson = json => {
    const data = JSON.parse(json).data;
    const self = this;

    return Promise.all(
        data.map(data => self.createQuestWithAuthor(data))
    );
};

module.exports.setAuthor = async data => {
    const username = 'User_' + shortid.generate();
    const user = await User.create({
        username,
        password: constants.user.password,
        email: constants.user.email
    });
    data.authorId = user._id;
};

module.exports.createQuestWithAuthor = async (data, user) => {
    const username = 'User_' + shortid.generate();
    const email = shortid.generate() + constants.user.email;
    const author = user || await User.create({
        username,
        email,
        password: constants.user.password
    });

    const likes = [];

    if (data.likesCount) {
        const users = await generateUsers(data.likesCount);
        createdUsers.concat(users);
        for (let user of users) {
            likes.push(user._id);
        }
    }

    return await Quest.create({
        authorId: author._id,
        title: data.title,
        description: data.description || '',
        city: data.city || '',
        tags: data.tags || '',
        stages: data.stages || [],
        likes: likes || []
    });
};
