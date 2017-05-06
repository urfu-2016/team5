/* global $:true */

require('./modal__close.css');

$('.modal__close').on('click', function () {
    $('.modal').removeClass('show');
});

