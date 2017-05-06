/* global $:true */

require('./input-autocomplete.css');

var options = {
    url: '/api/autocomplete',
    getValue: 'City',
    list: {
        match: {
            enabled: true
        }
    }
};

$('.input-autocomplete').easyAutocomplete(options);
