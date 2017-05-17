/* global ymaps:true */

require('./ymap.css');

function init(id) {
    var yekatCoords = [56.837527, 60.605943];
    var placemark;
    var map = new ymaps.Map('map' + id, {
        center: yekatCoords,
        zoom: 12
    });
    map.events.add('click', function (e) {
        var coords = e.get('coords');

        if (placemark) {
            placemark.geometry.setCoordinates(coords);
        } else {
            placemark = createPlacemark(coords);
            map.geoObjects.add(placemark);
            placemark.events.add('dragend', function () {
                getAddress(placemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
        document.getElementById('coords' + id).value = e.get('coords');
    });

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        });
    }

    function getAddress(coords) {
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
        });
    }
}

module.exports = init;
