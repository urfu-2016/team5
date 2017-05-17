const quests = require('../../../scripts/quests.json');

function getParams(title, name, options) {
    return {title, name, options};
}

function makeCitiesObject() {
    const citiesObj = {};
    citiesObj['Выберите город'] = '';
    for (let quest of quests.data) {
        citiesObj[quest.city] = quest.city;
    }

    return citiesObj;
}

module.exports = {
    params: {
        likesCount: getParams(
            'Количество лайков',
            'likesCount',
            {
                'Выберите количество': 0,
                'Не менее 10': 10,
                'Не менее 20': 20,
                'Не менее 40': 40
            }
        ),
        reviewsCount: getParams(
            'Количество отзывов',
            'reviewsCount',
            {
                'Выберите количество': 0,
                'Не менее 10': 10,
                'Не менее 20': 20,
                'Не менее 40': 40
            }
        ),
        searchCity: getParams(
            'Город',
            'searchCity',
            makeCitiesObject()
        ),
        searchByField: getParams(
            'Искать только в поле:',
            'searchByField',
            {
                'Выберите поле': '',
                Автор: 'author',
                Название: 'title',
                Тег: 'tags'
            }
        ),
        imagesCount: getParams(
            'Количество картинок',
            {
                from: 'imagesCountFrom',
                to: 'imagesCountTo'
            }
        )
    }
};
