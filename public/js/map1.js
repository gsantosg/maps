var map;
var drawingManager;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: { lat: 21.883501, lng: -102.293532 }
    });
    drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle']
        },
        markerOptions: {
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event){
        if (event.type == 'polygon') {
            $.each(event.overlay.getPaths(), function(index, val) {
                console.log(val)
            });
        }
        if (event.type == 'circle') {
            console.log(event.)
        }
    });
}