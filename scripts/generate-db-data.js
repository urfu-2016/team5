'use strict';

const User = require('../models/user');
const Quest = require('../models/quest');

function createAll(model, allData) {
    return Promise.all(
        allData.map(data => model.create(data))
    );
}

function createFromJson(model, json) {
    const data = JSON.parse(json).data;
    return createAll(model, data);
}

function generateImages({questId, imagesCount = 10}) {
    const images = [];
    const dummyUrl = 'https://dummyimage.com';
    const imageSize = '300x300';
    const backgroundColor = '555';
    const foregroundColor = 'ffd70';

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
                    title: `Заголовок ${i}`,
                    description: `Описание ${i}`,
                    author: user,
                    images: generateImages({questId: i}),
                    slug: `${i}`,
                    city: 'Екатеринбург'
                };

                quests.push(questData);
            }

            return createAll(Quest, quests)
        });
};

module.exports.generateUsers = ({usersCount = 1}) => {
    const users = [];

    for (let i = 0; i < usersCount; i++) {
        let userData = {
            firstname: `Пользователь ${i}`,
            surname: `Фамилия ${i}`,
            nickname: `user_${i}`
        };

        users.push(userData);
    }

    return createAll(User, users);
};

module.exports.createUsersFromJson = json => createFromJson(User, json);

module.exports.createQuestsFromJson = json => createFromJson(Quest, json);
