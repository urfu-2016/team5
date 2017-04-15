$(document).ready(function() {
    $('.navbar__toggler').on('click', function (e) {
        var id = $(this).attr('data-target');
        $(id).toggleClass('show');
    });
});