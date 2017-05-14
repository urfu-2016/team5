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
    const form = this;
    const msg = $(form).serialize();
    const formMessage = $('.form-message');
    formMessage.html('');

    const btnPrimary = $(form).find('.btn_primary');
    btnPrimary.prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: form.action,
        data: msg,

        success: function (res) {
            if (form.action.endsWith('/signin')) {
                window.location.reload();
            } else if (form.action.endsWith('/signup')) {
                formMessage.html(res).addClass('success').removeClass('error');
                $('.tabs__item:first-child .tabs__link').click();
            } else if (form.action.endsWith('/password-reset')) {
                formMessage.html(res);
            }

            btnPrimary.prop('disabled', false);
        },

        error: function (res) {
            formMessage.html(res.responseText).addClass('error').removeClass('success');
            btnPrimary.prop('disabled', false);
        }
    });

    return false;
});
