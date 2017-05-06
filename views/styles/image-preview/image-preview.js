/* global $:true */

require('./image-preview.css');
require('./__preview/image-preview___preview.css');

$('.image-preview__input').on('change', function () {
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(input).parent().find('.image-preview__img').attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}
