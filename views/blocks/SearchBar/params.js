function getParams(title, name, options) {
    return {title, name, options};
}

module.exports = {
    params: {
        likesCount: getParams('Количество ♥', 'countOfLikes',
            {0: 'Выберите количество', 1: 'Не менее 10', 2: 'Не менее 20', 3: 'Не менее 40'}),
        reviewsCount: getParams('Количество отзывов', 'reviwesCount',
            {0: 'Выберите количество', 1: 'Не менее 10', 2: 'Не менее 20', 3: 'Не менее 40'}),
        searchCity: getParams('Город', 'searchCity',
            {0: 'Выберите город', 1: 'Екатеринбург', 2: 'Каменск-Уральский', 3: 'Ивдель'}),
        searchByField: getParams('Искать только в поле:', 'searchByField',
            {0: 'Выберите поле', 1: 'Автор', 2: 'Название', 3: 'Тег'}),
        imagesCount: getParams('Количество картинок', {from: 'imagesCountFrom', to: 'imagesCountTo'}, {})
    }
};
