function searchRequest(params) {
    return fetch('/search', {method: 'POST', body: JSON.stringify(params)});
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
        searchPageNumber: newPageNumber
    };
}

module.exports = {
    searchRequest,
    getSearchParameters
};
