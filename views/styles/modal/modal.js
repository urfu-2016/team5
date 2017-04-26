/* global $:true */

require('./__footer/modal__footer.css');
require('./__backdrop/modal__backdrop.css');
require('./__body/modal__body.css');
require('./__close/modal__close');
require('./__data/modal__data.css');
require('./__title/modal__title.css');
require('./__dialog/modal__dialog.css');
require('./__info/modal__info.css');
require('./__header/modal__header.css');
require('./modal.css');

$('[data-toggle="modal"]').on('click', function () {
    var target = $(this).attr('data-target');
    $(target).addClass('show');
});
