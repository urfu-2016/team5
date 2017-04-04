'use strict';

const User = require('../models/user');
const Quest = require('../models/quest');
const constants = require('../constants/generation');

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

module.exports.generateQuests = ({questsCount = 10}) => {
    const quests = [];

    return User.create({username: 'User' + Date.now()})
        .then(user => {
            for (let i = 0; i < questsCount; i++) {
                let questData = {
                    title: `${constants.quest.titlePrefix} ${i}`,
                    description: `${constants.quest.descriptionPrefix} ${i}`,
                    author: user,
                    images: generateImages({questId: i}),
                    slug: `${i}`,
                    city: constants.quest.city
                };

                quests.push(questData);
            }

            return createAll(Quest, quests);
        });
};

module.exports.generateUsers = ({usersCount = 1}) => {
    const users = [];

    for (let i = 0; i < usersCount; i++) {
        let userData = {
            firstname: `${constants.user.firstnamePrefix} ${i}`,
            surname: `${constants.user.surnamePrefix} ${i}`,
            username: `${constants.user.usernamePrefix}${i}`
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

    return Promise.all(
        data.map(data => Quest._createWithAuthor(data))
    );
};
