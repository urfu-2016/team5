/* global $:true */

require('./dropdown-menu.css');
require('./__item/dropdown-menu__item.css');

$('.dropdown-toggle').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $(this).parent().toggleClass('show-dropdown-menu');
});
