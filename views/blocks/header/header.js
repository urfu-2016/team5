/* global $:true */

require('../../styles/main.css');
require('../../styles/btn/btn');
require('../../styles/dropdown-menu/dropdown-menu');
require('../../styles/input-group/input-group');
require('../../styles/modal/modal');
require('../../styles/navbar/navbar');
require('../../styles/tab-content/tab-content');
require('../../styles/tabs/tabs');
require('../../styles/avatar/avatar');
require('./head_arrow.png');

const search = document.getElementById('search');
search.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchString = document.getElementById('searchString').value;
    window.location.href = '/quests?type=string&string=' + searchString;
});

$('.auth-form').on('submit', function () {
    $('.form-message').html('');
    const form = this;
    const msg = $(form).serialize();
    $(form).find('.btn_primary').prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: form.action,
        data: msg,

        success: function (res) {
            if (form.action.endsWith('/signin')) {
                window.location.reload();
            } else if (form.action.endsWith('/signup')) {
                $('.form-message').html(res);
                $('.tabs__item:first-child .tabs__link').click();
            } else if (form.action.endsWith('/password-reset')) {
                $('.form-message').html(res);
            }

            $(form).find('.btn_primary').prop('disabled', false);
        },

        error: function (res) {
            $('.form-message').html(res.responseText).css('color', '#f33');
            $(form).find('.btn_primary').prop('disabled', false);
        }
    });

    return false;
});
