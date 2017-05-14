/* global $:true */

$('main').on('click', '.add-quest__button', function () {
    $('.add-quest__tabs').find('.tabs__link.active').removeClass('active');
    $('.quests-content').find('.tab-content__panel.active').removeClass('active');

    var id = generateId();

    var tab = createTab(id);
    $('.add-quest__tabs').append(tab);

    var tabContent = createTabContent(id);
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
    return '<div class="tab-content__panel active" id="' + id + '" role="tabpanel">' +
        '<form enctype="multipart/form-data" id="' + id + id + '" method="POST">' +
        '<div class="row">' +
        '<div class="col-4 add-quest">' +
        '<div class="add-quest__preview">' +
        '<input name="image" type="file" accept="image/jpeg, image/png" class="add-quest__input">' +
        '<div class="add-quest__info">Перетащите сюда картинку или нажмите на кнопку</div>' +
    '<div class="add-quest__footer">' +
        '<button class="btn add-quest__add-image">Добавить</button>' +
        '</div>' +
        '</div>' +
        '<div class="add-quest__image hide">' +
        '<span class="add-quest__action action_rotate"></span>' +
        '<span class="add-quest__action action_delete"></span>' +
        '<img class="rotate0deg" src="" alt="">' +
        '</div>' +
        '</div>' +
        '<div class="col-8">' +
        '<div class="input-group">' +
        '<label>Название</label>' +
        '<input type="text" class="input-group__input input_dark title" maxlength="30" required>' +
    '</div>' +
    '<div class="input-group">' +
        '<label>Месторасположение</label>' +
        '<input type="text" class="input-group__input input_dark location" required>' +
    '</div>' +
    '<div class="input-group">' +
        '<label>Описание</label>' +
        '<textarea class="input-group__textarea description"></textarea>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '<button type="button" class="btn btn_primary float_right add-quest_delete">Удалить</button>' +
        '</div>';
}
