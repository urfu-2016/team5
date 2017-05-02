'use strict';

const User = require('../models/user');
const Quest = require('../models/quest');
const constants = require('../constants/generation');
const shortid = require('shortid');

function createAll(model, allData) {
    return Promise.all(
        allData.map(data => model.create(data))
    );
}

function generateImages({questId, imagesCount = 10}) {
    const images = [];
    const {dummyUrl, imageSize, backgroundColor, foregroundColor} = constants.image;

    for (let i = 0; i < imagesCount; i++) {
        let query = `${imageSize}/${backgroundColor}/${foregroundColor}`;
        let imageData = {
            title: `title ${i}`,
            src: `${dummyUrl}/${query}&text=quest+${questId}+${i}`
        };

        images.push(imageData);
    }

    return images;
}

module.exports.generateQuests = async ({questsCount = 10}) => {
    const quests = [];
    const user = await User.create({
        username: 'User' + Date.now(),
        email: shortid.generate() + constants.user.email,
        password: constants.user.password
    });

    for (let i = 0; i < questsCount; i++) {
        let questData = {
            title: `${constants.quest.titlePrefix} ${i}`,
            description: `${constants.quest.descriptionPrefix} ${i}`,
            authorId: user._id,
            images: generateImages({questId: i}),
            slug: `${i}`,
            city: constants.quest.city
        };

        quests.push(questData);
    }

    return createAll(Quest, quests);
};

module.exports.generateUsers = ({usersCount = 1}) => {
    const users = [];

    for (let i = 0; i < usersCount; i++) {
        let userData = {
            firstname: `${constants.user.firstnamePrefix} ${i} ${shortid.generate()}`,
            surname: `${constants.user.surnamePrefix} ${i}`,
            username: `${constants.user.usernamePrefix}${i}`,
            email: `${i}${constants.user.email}`,
            password: constants.user.password
        };

        users.push(userData);
    }

    return createAll(User, users);
};

module.exports.createUsersFromJson = json => {
    const data = JSON.parse(json).data;

    return createAll(User, data);
};

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

    return await Quest.create({
        authorId: author._id,
        title: data.title,
        description: data.description || '',
        city: data.city || '',
        tags: data.tags || '',
        images: data.images || []
    });
};
