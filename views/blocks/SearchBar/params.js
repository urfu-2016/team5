function Param(title, name, options) {
    this.name = name;
    this.title = title;
    this.options = options;
}

module.exports = {
    params: {
        likesCount: new Param('Количество likov', 'countOfLikes', {}),
        reviewsCount: new Param('Количество otzivov', 'reviwesCount', {}),
        searchCity: new Param('Город', 'searchCity', {}),
        searchByField: new Param('Искать только в поле:', 'searchByField', {}),
        imagesCount: new Param('Количество картинок', 'imagesCount', {})
    }
};
