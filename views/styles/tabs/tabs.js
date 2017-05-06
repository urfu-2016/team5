/* global $:true */

require('./tabs.css');
require('./__item/tabs__item.css');
require('./__link/tabs__link.css');

$('.tabs__link').on('click', function () {
    if ($(this).hasClass('active')) {
        return;
    }

    var id = $(this).attr('href');

    $('.tabs__link.active').removeClass('active');
    $(this).addClass('active');

    $('.tab-content__panel.active').removeClass('active');
    $(id).addClass('active');
});
