require('./modal.css');
require('./__backdrop/modal__backdrop.css');
require('./__body/modal__body.css');
require('./__close/modal__close.css');
require('./__close/modal__close');
require('./__data/modal__data.css');
require('./__dialog/modal__dialog.css');
require('./__header/modal__header.css');
require('./__info/modal__info.css');
require('./__title/modal__title.css')


$('[data-toggle="modal"]').on('click', function(e) {
    var target = $(this).attr('data-target');
    $(target).addClass('show');
})

$('.tabs__link').on('click', function(e) {
    if ($(this).hasClass('active'))
        return;

    var id = $(this).attr('href');

    $('.tabs__link.active').removeClass('active');
    $(this).addClass('active');

    $('.tab-content__panel.active').removeClass('active');
    $(id).addClass('active');
});
