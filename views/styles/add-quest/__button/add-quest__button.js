/* global $:true */
/* global ymaps:true */

var init = require('../../ymap/ymap');

$('main').on('click', '.add-quest__button', function () {
    $('.add-quest__tabs').find('.tabs__link.active').removeClass('active');
    $('.quests-content').find('.tab-content__panel.active').removeClass('active');

    var id = generateId();

    var tab = createTab(id);
    $('.add-quest__tabs').append(tab);

    var tabContent = createTabContent(id);
    ymaps.ready(init.bind(this, id));
    $('.quests-content').append(tabContent);
});

function generateId() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function createTab(id) {
    return '<li class="tabs__item">\n' +
        '<a class="tabs__link active" href="#' + id + '" role="tab">Без названия</a>\n' +
    '</li>';
}

function createTabContent(id) {
    return (
        '<div class="tab-content__panel active" id="' + id + '" role="tabpanel">' +
        '<div class="row">' +
        '<div class="col-4 add-quest">' +
        '<div class="add-quest__preview">' +
        '<input name="image" type="file" accept="image/jpeg, image/png" class="add-quest__input">' +
        '<div class="add-quest__info">Перетащите сюда картинку или нажмите на кнопку</div>' +
        '<div class="add-quest__footer">' +
        '<button type="button" class="btn add-quest__add-image">Добавить</button>' +
        '</div>' +
        '</div>' +
        '<div class="add-quest__image hide">' +
        '<span class="add-quest__action action_delete"></span>' +
        '<img class="rotate0deg" src="" alt="">' +
        '</div>' +
        '</div>' +
        '<div class="col-8">' +
        '<div class="input-group">' +
        '<label>Название</label>' +
        '<input name="title" type="text" class="input-group__input input_dark title" maxlength="30" required>' +
        '</div>' +
        '<div class="input-group map-group">' +
        '<label>Месторасположение</label>' +
        '<input type="text" class="location" id="coords' + id + '" hidden>' +
        '<div class="ymap" id="map' + id + '"></div>' +
        '</div>' +
        '<div class="input-group">' +
        '<label>Описание</label>' +
        '<textarea name="description" class="input-group__textarea description"></textarea>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<button type="button" class="btn btn_primary float_right add-quest_delete">Удалить</button>' +
        '</div>'
    );
}
// '<input name="location" type="text" class="input-group__input input_dark location" required>' +
