/* global $:true */

require('./__button/add-quest__button');
require('./__input/add-quest__input.css');
require('./add-quest.css');
require('./__action/add-quest__action');

$('.quests-content').on('click', '.add-quest__add-image', function () {
    $(this).closest('.add-quest__preview').find('.add-quest__input').click();
});

$('.quests-content').on('change', '.add-quest__input', function () {
    $(this).parent().addClass('hide');

    var addQuestBlock = $(this).closest('.add-quest');
    var questImage = $(addQuestBlock).find('.add-quest__image');
    $(questImage).removeClass('hide');

    var file = $(this).prop('files')[0];
    var reader = new FileReader();

    reader.addEventListener('load', function () {
        $(questImage).find('img').attr('src', reader.result);
    });

    reader.readAsDataURL(file);
});
