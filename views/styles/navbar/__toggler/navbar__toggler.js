$('.navbar__toggler').on('click', function () {
    var id = $(this).attr('data-target');
    $(id).toggleClass('show');
});
