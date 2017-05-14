function getGeolocation(callback) {
    if (navigator.geolocation) {
        var options = {
            enableHighAccuracy: true,
            maximumAge: 50000,
            timeout: 10000
        };

        navigator.geolocation.getCurrentPosition(
            position => {
                callback(null, position);
            },
            error => {
                callback(error);
            },
            options
        );
    } else {
        callback(new Error('Geolocation API не поддерживается'));
    }
}

module.exports = {
    getGeolocation
};
