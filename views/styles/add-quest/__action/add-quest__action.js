/* global $:true */

require('./add-quest__action.css');
// Require('./actions.svg');

$('.quests-content').on('click', '.action_rotate', function () {
    var img = $(this).parent().find('img');

    var classname = $(img).attr('class');
    var angle = classname.match(/rotate(\d+)deg/i);

    if (angle) {
        classname = classname.replace(/rotate(\d+)deg/i, function (match, d) {
            var newAngle = Number.parseInt(d, 10) + 90;
            newAngle %= 360;
            return 'rotate' + newAngle + 'deg';
        });
        $(img).attr('class', classname);
    } else {
        $(img).addClass('rotate90deg');
    }
});

$('.quests-content').on('click', '.action_delete', function () {
    $(this).closest('.add-quest').find('.add-quest__preview').removeClass('hide');
    $(this).parent().addClass('hide');
    /*
    Var tablink = $(this).parent().find('.tabs__link');
    if ($(tablink).hasClass('active') && $('.image-preview').children().length > 1) {
        var firstTab = $('.image-preview').children()[0];
        $(firstTab).find('.tabs__link').addClass('active');

        var firstContent = $('.quests-content').children()[0];
        $(firstContent).addClass('active');
    }

    var id = $(tablink).attr('href');
    $(id).remove();
    $(this).parent().remove(); */
});
