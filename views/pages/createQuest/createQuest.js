/* global $:true */

require('../../styles/container/container.css');
require('../../styles/input-autocomplete/input-autocomplete');
require('../../styles/image-preview/image-preview');

$('#title, #city, #description').on('blur', function () {
    if ($(this).val() === '') {
        $(this).addClass('input_error');
        $(this).attr('placeholder', 'Please enter ' + $(this).attr('id'));
    } else {
        $(this).removeClass('input_error');
    }

    var empty = false;

    $('input:required, textarea:required').each(function (idx, el) {
        var value = $(el).val();
        if (/^\s*$/.test(value)) {
            empty = true;
        }
    });

    if (empty) {
        $('button[role="createquest"]').addClass('btn_disabled');
    } else {
        $('button[role="createquest"]').removeClass('btn_disabled');
    }
});

$('button[role="createquest"]').on('click', function () {
    if ($(this).hasClass('btn_disabled')) {
        return;
    }

    var info = {};

    info.title = $('#title').val();
    info.city = $('#city').val();
    info.description = $('#description').val();
    info.stages = [];

    var stages = $('.quests-content').children();
    var images = $('.image-preview').children().find('.image-preview__img');
    for (var i = 0; i < stages.length; i++) {
        info.stages[i] = {
            title: $(stages[i]).find('.title').val(),
            location: $(stages[i]).find('.location').val(),
            description: $(stages[i]).find('.description').val(),
            image: $(images[i]).attr('src')
        };
    }
    $.post('/api/quests', info);
});
