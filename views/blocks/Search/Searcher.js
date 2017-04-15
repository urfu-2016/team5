const queryString = require('query-string');

function searchRequest(params) {
    var uri = queryString.stringify(params);
    return fetch(`/search/?${uri}`);
}

function getSearchParameters(state, newPageNumber) {
    return {
        searchString: state.searchString,
        likesCount: state.likesCount,
        reviewsCount: state.reviewsCount,
        searchCity: state.searchCity,
        searchByField: state.searchByField,
        imagesCountFrom: state.imagesCountFrom,
        imagesCountTo: state.imagesCountTo,
        searchPage: newPageNumber
    };
}

module.exports = {
    searchRequest,
    getSearchParameters
};
