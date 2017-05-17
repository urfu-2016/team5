/* global ymaps:true */

require('./ymap.css');

function init(id) {
    var yekatCoords = [56.837527, 60.605943];
    var map = new ymaps.Map('map' + id, {
        center: yekatCoords,
        zoom: 12
    });
    var placemark = new ymaps.Placemark(yekatCoords);
    getAddress(yekatCoords, placemark, id);
    map.controls.remove('geolocationControl');
    map.geoObjects.add(placemark);

    var searchControl = map.controls.get('searchControl');
    searchControl.events.add('resultselect', function (e) {
        var index = e.get('index');
        var target = e.get('target');
        target.getResult(index)
            .then(function (result) {
                var coords = result.geometry.getCoordinates();
                updatePlacemark(placemark, coords, id);
            });
        target.hideResult();
    });

    // Обработк кликов
    map.events.add('click', function (e) {
        var coords = e.get('coords');
        updatePlacemark(placemark, coords, id);
    });

    var geolocationControl = addGeolocation(placemark, id);
    map.controls.add(geolocationControl);
}

function getAddress(coords, placemark, id) {
    placemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);
        placemark.properties
            .set({
                iconCaption: [
                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                balloonContent: firstGeoObject.getAddressLine()
            });
        document.getElementById('coords' + id).value = coords;
    });
}

function addGeolocation(placemark, id) {
    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {noPlacemark: true}
    });
    geolocationControl.events.add('locationchange', function (event) {
        var position = event.get('position');
        updatePlacemark(placemark, position, id);
    });

    return geolocationControl;
}

function updatePlacemark(placemark, coords, id) {
    placemark.geometry.setCoordinates(coords);
    getAddress(coords, placemark, id);
}

module.exports = init;
