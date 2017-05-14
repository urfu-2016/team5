/* global $:true */

require('./tags.css');

$('.tags').on('click', function () {
    $('.tags input').focus();
    $('.tags').addClass('focus');
});

$('.tags input').on('keyup', function (e) {
    if (e.which === 13) {
        var tag = createTag($(this).val());
        $(tag).insertBefore($('.tags input'));

        $(this).val('');
    }

    function createTag(text) {
        return '<div class="tag">' + text + ' <span class="close fa fa-times"></span></div>';
    }
});

$('.tags').on('click', '.close', function () {
    $(this).closest('.tag').remove();
});

window.onclick = function (event) {
    if (!event.target.matches('.tags') && !event.target.matches('.tag') && !event.target.matches('.tags input')) {
        $('.tags').removeClass('focus');
    }
    event.stopPropagation();
};
