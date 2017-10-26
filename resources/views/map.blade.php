<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
            }

            #map{
                height: 75%;
            }
            .form-group > ul > li{
                list-style: none;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div class="container">
            <div class="row">
                <div class="col-md-2">
                    <div class="form-group">
                        <ul>
                            <li>
                                <button class="btn btn-primary" onclick="drawPolygon()">Dibujar Círculo</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="name">Nombre del área</label>
                        <input class="form-control" type="text" name="name" id="name" required>
                        <span id="nameError" class="error text-danger"></span>
                    </div>
                    <div class="form-group">
                        <label for="code">Código del área</label>
                        <input class="form-control" type="text" name="code" id="code" required>
                        <span id="codeError" class="error text-danger"></span>
                    </div>
                    <button id="sv_new_zone" class="btn btn-primary" onclick="saveZone()">Guardar</button>
                    <button id="updt_zone" class="btn btn-primary" onclick="updateZone()" style="display: none">Guardar Cambios</button>
                </div>
            </div>
        </div>
    </body>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/map.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAHBR9uA9Jxyp-XOMRIu97ry3M7McHj1EU&callback=initMap&libraries=drawing"
        async defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
</html>
