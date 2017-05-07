/* global $:true */

require('./image-preview__action.css');
// require('./actions.svg');

$('.image-preview').on('click', '.action_rotate', function () {
    var img = $(this).parent().find('.image-preview__img');

    var classname = $(img).attr('class');
    var angle = classname.match(/rotate(\d+)/i);

    if (angle) {
        classname = classname.replace(/rotate(\d+)/i, function (match, d) {
            var newAngle = Number.parseInt(d, 10) + 90;
            newAngle %= 360;
            return 'rotate' + newAngle;
        });
        $(img).attr('class', classname);
    } else {
        $(img).addClass('rotate90');
    }
});

$('.image-preview').on('click', '.action_delete', function () {
    var tablink = $(this).parent().find('.tabs__link');
    if ($(tablink).hasClass('active') && $('.image-preview').children().length > 1) {
        var firstTab = $('.image-preview').children()[0];
        $(firstTab).find('.tabs__link').addClass('active');

        var firstContent = $('.quests-content').children()[0];
        $(firstContent).addClass('active');
    }

    var id = $(tablink).attr('href');
    $(id).remove();
    $(this).parent().remove();
});
