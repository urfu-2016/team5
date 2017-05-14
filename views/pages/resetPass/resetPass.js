/* global $:true */

require('./reset-pass.css');

$('.reset-form').on('submit', function () {
    const form = this;
    const msg = $(form).serialize();
    const $formMessage = $('.form-message');
    $formMessage.html('');

    const $btnPrimary = $(form).find('.btn_primary');
    $btnPrimary.prop('disabled', true);

    $.ajax({
        type: 'POST',
        url: form.action,
        data: msg,

        success: function (res) {
            if (form.action.includes('/password-reset')) {
                $formMessage.html(res);
            }

            $btnPrimary.prop('disabled', false);
        },

        error: function (res) {
            $formMessage.html(res.responseText).addClass('error').removeClass('success');
            $btnPrimary.prop('disabled', false);
        }
    });

    return false;
});
