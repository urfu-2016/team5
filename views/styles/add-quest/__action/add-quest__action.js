/* global $:true */

require('./add-quest__action.css');

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

    var input = $(this).closest('.add-quest').find('.add-quest__input').get(0);
    var $el = $(input);

    $el.wrap('<form>').closest('form').get(0).reset();
    $el.unwrap();
});
