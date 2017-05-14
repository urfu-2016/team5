require('./reset-pass.css');

const formValidation = require('../../../libs/clientScripts/form-validation');

function success(form, $formMessage, $btnPrimary, res) {
    if (form.action.includes('/password-reset')) {
        $formMessage.html(res);
    }

    $btnPrimary.prop('disabled', false);
}

formValidation(success, '.reset-form');
