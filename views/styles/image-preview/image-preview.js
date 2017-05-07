/* global $:true */

require('./image-preview.css');
require('./__preview/image-preview___preview.css');
require('./__action/image-preview__action');
require('./__img/image-preview__img.css');
require('./add_photo.png');

var input = document.getElementsByClassName('image-preview__input')[0];
var questContent = document.getElementsByClassName('quests-content')[0];

input.addEventListener('change', function () {
    var files = input.files; // FileList
    var reader = new FileReader();

    for (var i = 0; i < files.length; i++) {
        var image = files[i];
        reader.readAsDataURL(image);
        reader.addEventListener('load', function () {
            var id = makeId();
            var tab = createTab(reader.result, id);
            var tabContent = createTabContent(id);

            $('.image-preview .tabs__link.active').removeClass('active');
            $('.quests-content .tab-content__panel.active').removeClass('active');

            var children = $('.image-preview').children();
            var last = children[children.length - 1];

            $(tab).insertBefore(last);
            $(questContent).append($(tabContent));
        });
    }
});

function makeId() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 7; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function createTab(imgsrc, id) {
    return '<li class="tabs__item image-preview___preview">\n' +
        '<span class="image-preview__action action_rotate"></span>\n' +
        '<span class="image-preview__action action_delete"></span>\n' +
        '<a class="tabs__link active" href="#' + id + '">\n' +
        '<img class="image-preview__img"\n' +
    'src="' + imgsrc + '">\n' +
        '</a>\n' +
        '</li>';
}

function createTabContent(id) {
    return '<div class="tab-content__panel active" id="' + id + '" role="tabpanel">\n' +
        '<div class="input-group">\n' +
        '<label>Title</label>\n' +
        '<input type="text" class="input-group__input input_dark title" required>\n' +
        '</div>\n' +
        '<div class="input-group">\n' +
        '<label>Location</label>\n' +
        '<input type="text" class="input-group__input input_dark location" required>\n' +
        '</div>\n' +
        '<div class="input-group">\n' +
        '<label>Description</label>\n' +
        '<textarea class="input-group__textarea description"></textarea>\n' +
        '</div>\n' +
        '</div>';
}
