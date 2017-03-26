/* global document */
/* global XMLHttpRequest */

// Убогое подобие кода
function createQuest(quest) {
    const questElement = document.createElement('div');
    const card = document.createElement('div');
    const caption = document.createElement('div');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    // const tags = document.createElement('p');
    const tag = document.createElement('span');
    const linkToQuest = document.createElement('a');

    questElement.className = 'col-md-4 col-sm-6 quest';
    card.className = 'thumbnail card';
    caption.className = 'caption';
    tag.className = 'badge';
    linkToQuest.className = 'btn btn-xs pull-right';

    linkToQuest.setAttribute('href', `/quest/${quest.slug}`);
    linkToQuest.innerHTML = 'More';
    title.innerHTML = quest.title;
    description.innerHTML = quest.description;

    caption.appendChild(title);
    caption.appendChild(description);
    caption.appendChild(linkToQuest);
    card.appendChild(caption);
    questElement.appendChild(card);

    document.body.appendChild(questElement);
}

function cleanQuests() {
    const quests = document.querySelectorAll('.quest');
    quests.forEach(quest => {
        quest.remove();
    });
}

function httpGetAsync(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function searchByProperty(propertyName, searchStr, quests) {
    searchStr = searchStr.toLowerCase();

    return quests.filter(quest => {
        let propertyData = quest[propertyName].toLowerCase();

        return propertyData.indexOf(searchStr) === 0;
    });
}

function searchByTitle(searchStr, quests) {
    return searchByProperty('title', searchStr, quests);
}

let quests = [];
let isHaveQuests = false;
let filteredQuests = [];
const searchElement = document.querySelector('[name="search"]');

httpGetAsync('/api/quests')
    .then(response => {
        isHaveQuests = true;
        quests = response.data;
    })
    .catch(err => {
        console.log(err);
    });

searchElement.addEventListener('input', event => {
    if (isHaveQuests) {
        let searchValue = event.target.value;
        filteredQuests = searchByTitle(searchValue, quests);
        console.log(filteredQuests);
        cleanQuests();
        filteredQuests.forEach(createQuest);
    }
});
