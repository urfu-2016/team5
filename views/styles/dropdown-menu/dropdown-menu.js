/* global $:true */

require('./dropdown-menu.css');
require('./__item/dropdown-menu__item.css');

$('.dropdown-toggle').on('click', function () {
    $(this).parent().toggleClass('show-dropdown-menu');
});

window.onclick = function (event) {
    if (!event.target.matches('.avatar__image') && !event.target.matches('.avatar__arrow')) {
        var dropdowns = document.getElementsByClassName('dropdown-toggle');
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.parentNode.classList.contains('show-dropdown-menu')) {
                openDropdown.parentNode.classList.remove('show-dropdown-menu');
            }
        }
    }
    event.stopPropagation();
};
