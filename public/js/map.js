var map;
var drawingManager;
var circle;
var listener, listener2;
var cities;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 19.213501, lng: -99.293532 }
    });

    initDrawManager();

    getCities();
}

function saveZone()
{
    var name = $('#name').val();
    var code = $('#code').val();

    $.ajax({
        url: '/cities',
        type: 'POST',
        data: {
            name: name,
            code: code,
            lat: circle ? circle.center.lat() : null,
            lng: circle ? circle.center.lng() : null,
            rad: circle ? circle.radius : null
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })
    .done(function(response) {
        if (response.status == 1) {
            toastr.success( 'Se almacenó correctamente.', '¡Éxito!', { timeOut: 4000 } );
            $('#name').val('')
            $('#code').val('')
        } else if (response.errors) {
            $('#nameError').html(response.errors.name)
            $('#codeError').html(response.errors.code)
            setTimeout(function() {
                $('#nameError').html('')
                $('#codeError').html('')
            }, 3000);
        } else {
            toastr.error('Ocurrió un error, intenta nuevamente.', '¡Error!', { timeOut: 4000 });
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function(){
        getCities();
    });

    clearPolygon()
}

function initDrawManager()
{
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle']
        },
        circleOptions: {
            fillColor: '#333333',
            fillOpacity: .4,
            strokeWeight: 2,
            clickable: false,
            editable: true,
            draggable: true,
            zIndex: 1
        }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event){
        if (event.type == 'circle') {
            circle = event.overlay;
            drawingManager.setDrawingMode(null);
            listener = map.addListener('click', clearPolygon);
        }
    });
}

function initCircle(circle)
{
    clearPolygon();

    this.circle = circle;

    circle.setEditable(false);
}

function drawPolygon()
{
    if (drawingManager) {
        drawingManager.setDrawingMode('circle')
    }
}

function editPolygon()
{
    if (circle) {
        circle.setEditable(true)
    } else {
        toastr.warning('No hay ningún circulo', '¡Ojo!', {timeOut: 1000});
    }
}

function clearPolygon()
{
    if (circle) {
        circle.setEditable(false);
        circle.setMap(null);
        circle = null;
        if (listener) {
            google.maps.event.removeListener(listener)
        }
    } else {
        toastr.warning('No hay ningún circulo', '¡Ojo!', {timeOut: 1000});
    }
}

function getCities()
{
    $.ajax({
        url: '/cities',
        type: 'GET',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function() {
            clearCities();
        },
        success: function(response) {
            $.each(response.data, function(index, val) {
                var zone = new google.maps.Circle({
                    strokeColor: '#333333',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#333333',
                    fillOpacity: 0.35,
                    center: {lat: parseFloat(val.lat), lng: parseFloat(val.lng)},
                    radius: parseFloat(val.rad),
                    zIndex: 1,
                    id: val.id,
                    name: val.name,
                    code: val.code
                });
                cities.push(zone);
            });
            showCities();
        }
    });
}

function updateZone()
{
    var name = $('#name').val();
    var code = $('#code').val();
    var id = $('#updt_zone').attr('data-id');

    $.ajax({
        url: '/cities',
        method: 'PUT',
        data: {
            id: id,
            name: name,
            code: code,
            lat: circle ? circle.center.lat() : null,
            lng: circle ? circle.center.lng() : null,
            rad: circle ? circle.radius : null
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    })
    .done(function(response) {
        if (response.status == 1) {
            toastr.success( 'Se actualizó correctamente.', '¡Éxito!', { timeOut: 4000 } );
            $('#name').val('')
            $('#code').val('')
        } else if (response.errors) {
            $('#nameError').html(response.errors.name)
            $('#codeError').html(response.errors.code)
            setTimeout(function() {
                $('#nameError').html('')
                $('#codeError').html('')
            }, 3000);
        } else {
            toastr.error('Ocurrió un error, intenta nuevamente.', '¡Error!', { timeOut: 4000 });
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function(){
        getCities();
    });

    clearPolygon()
}

function clearCities() {
    if (cities) {
        for (var i = cities.length - 1; i >= 0; i--) {
            cities[i].setMap(null);
        }
    }
    cities = [];
}

function showCities() {
    if (cities) {
        for (var i = cities.length - 1; i >= 0; i--) {
            let zone = cities[i]
            zone.setMap(map);
            zone.addListener('click', function() {
                startEdition(zone);
            });
        }
        listener2 = map.addListener('click', cancelEdition);
    }
}

function startEdition(zone)
{
    circle = zone;
    circle.setEditable(true);
    $('#name').val(zone.name);
    $('#code').val(zone.code);
    $('#sv_new_zone').css('display', 'none');
    $('#updt_zone').attr('data-id', zone.id);
    $('#updt_zone').css('display', 'block');
}

function cancelEdition()
{
    if (circle) {
        circle.setEditable(false);
        circle.setMap(null);
    }
    if (listener2) {
        google.maps.event.removeListener(listener2)
    }
    showCities();
    $('#name').val('');
    $('#code').val('');
    $('#sv_new_zone').css('display', 'block');
    $('#updt_zone').removeAttr('data-id');
    $('#updt_zone').css('display', 'none');
}