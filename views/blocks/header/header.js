require('../../styles/main.css');
require('../../styles/btn/btn');
require('../../styles/dropdown-menu/dropdown-menu');
require('../../styles/input-group/input-group');
require('../../styles/modal/modal');
require('../../styles/navbar/navbar');
require('../../styles/tab-content/tab-content');
require('../../styles/tabs/tabs');
require('../../styles/image-preview/image-preview');

const search = document.getElementById('search');
search.addEventListener('submit', function (event) {
    event.preventDefault();
    const searchString = document.getElementById('searchString').value;
    window.location.href = '/quests?type=string&string=' + searchString;
});
