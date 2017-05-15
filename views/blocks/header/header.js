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

const formValidation = require('../../../libs/clientScripts/form-validation');

const search = document.getElementById('search');
search.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchString = document.getElementById('searchString').value;
    window.location.href = '/quests?type=string&string=' + searchString;
});

function success(form, $formMessage, $btnPrimary, res) {
    if (form.action.endsWith('/signin') || form.action.endsWith('/signup')) {
        if (window.location.href.includes('/password-reset') || window.location.href.includes('/register-verification')) {
            window.location.href = '/';
        } else {
            window.location.reload();
        }
    } else if (form.action.endsWith('/password-reset')) {
        $formMessage.html(res).addClass('success').removeClass('error');
        $(form).remove();
    }

    $btnPrimary.prop('disabled', false);
}

$('.tabs__link').on('click', function () {
    $('.auth-form-message').html('');
});

formValidation(success, '.auth-form');
