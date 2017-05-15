function getParams(title, name, options) {
    return {title, name, options};
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
            {
                'Выберите город': '',
                Екатеринбург: 'Екатеринбург',
                'Каменск-Уральский': 'Каменск-Уральский',
                Ивдель: 'Ивдель'
            }
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
