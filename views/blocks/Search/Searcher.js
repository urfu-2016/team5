function searchRequest(params) {
    return fetch('/search', {method: 'POST', body: JSON.stringify(params)});
}

function getSearchParameters(state, newPageNumber) {
    return {
        search: {
            text: state.searchString,
            field: state.searchByField
        },
        city: state.searchCity,
        images: {
            from: Number(state.imagesCountFrom),
            to: Number(state.imagesCountTo)
        },
        page: newPageNumber,
        likesCount: Number(state.likesCount),
        reviewsCount: Number(state.reviewsCount)
    };
}

module.exports = {
    searchRequest,
    getSearchParameters
};
