/* global $:true */

require('./dropdown-menu.css');
require('./__item/dropdown-menu__item.css');

console.log('before');
$('.dropdown-toggle').on('click', function (e) {
    console.log('in');
    e.preventDefault();
    e.stopPropagation();

    $(this).parent().toggleClass('show-dropdown-menu');
});
