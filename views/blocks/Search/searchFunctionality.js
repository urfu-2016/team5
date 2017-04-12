function search(params, currentPage) {
    var uri = Object.keys(params).map(param => param.concat('=', params[param])).join('&');
    uri = uri.concat('&searchPage=', currentPage);

    return fetch('/search/?' + uri);
}

module.exports = {
    search
};
