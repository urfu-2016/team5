function getCustomError(message, isNoConection) {
    var error = new Error(message);
    error.isNoConection = isNoConection;
    return error;
}

function checkStatus(res) {
    if (res.ok) {
        return res;
    }

    throw getCustomError(res.statusText, false);
}

function request(url, options, handles, parser) {
    parser = parser || (res => res);

    fetch(url, options)
        .then(checkStatus,
            error => {
                throw getCustomError(error.message, true);
            })
        .then(parser)
        .then(handles.handleSuccessfulSend)
        .catch(handles.handleFailedSend);
}

module.exports = request;
