function formValidation(success, formClassName) {
    $(formClassName).on('submit', function () {
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

            success: success.bind(null, form, $formMessage, $btnPrimary),

            error: function (res) {
                $formMessage.html(res.responseText).addClass('error').removeClass('success');
                $btnPrimary.prop('disabled', false);
            }
        });

        return false;
    });
}

module.exports = formValidation;
