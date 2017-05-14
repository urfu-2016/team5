/* global $:true */

require('./tabs.css');
require('./__item/tabs__item.css');
require('./__link/tabs__link.css');

$('.tabs').on('click', '.tabs__link', function () {
    if ($(this).hasClass('active')) {
        return;
    }

    var id = $(this).attr('href');

    $(this).closest('.tabs').find('.tabs__link.active').removeClass('active');
    $(this).addClass('active');

    var t = $(id).closest('.tab-content');
    var c = $(t).find('.tab-content__panel.active');
    $(c).removeClass('active');

    $(id).addClass('active');
});
