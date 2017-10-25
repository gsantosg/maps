var paths = [];
var map;
var poly;
var geometry;
var marker;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 21.883501, lng: -102.293532 }
    });
}

/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * Updates the encoding text area with the path's encoded values.
 */
function addLatLngToPoly(latLng, poly)
{
    path = poly.getPath();
    path.push(latLng);
    paths.push([latLng.lat(), latLng.lng()]);
}

function savePolygon()
{
    var name = $('#name').val();
    var code = $('#code').val();
    paths.push(paths[0]);

    if (paths[0] != undefined) {
        geometry = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            paths
                        ]
                    }
                }
            ]
        };
    }

    $.ajax({
        url: '/cities',
        type: 'POST',
        data: {
            name: name,
            code: code,
            polygon: JSON.stringify(geometry)
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })
    .done(function(response) {
        console.log(response);
    })
    .fail(function() {
        console.log("error");
    });

    clearPolygon()
}

function drawPolygon()
{
    initPolygon();

    google.maps.event.addListener(map, 'click', function(event) {
        addLatLngToPoly(event.latLng, poly);
    });  
}

function clearPolygon()
{
    poly!=undefined ? poly.setMap(null) : initPolygon();
}

function initPolygon() {
    poly = new google.maps.Polygon({
        strokeColor: '#ff0033',
        fillColor: '#ff0033',
        strokeOpacity: 1,
        strokeWeight: 3,
        map: map
    });
    paths = [];
}
