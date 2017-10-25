<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Storage;

class FilesController extends Controller
{
    public function index()
    {
    	$directories = Storage::allDirectories('geos');

    	foreach ($directories as $value) {
			$files = Storage::allFiles($value);
			$parts = explode('/', $value);
			$edoCode = strtoupper($parts[1]);
			$idEdo = 0;
			$latEdo = 0.0;
			$lngEdo = 0.0;
			$zoomEdo = 0;

    		foreach ($files as $value) {
    			echo 'Leyendo ' . $value . '<br>';
    			$contents = file_get_contents('storage/' . $value);
				$contents = json_decode($contents, true);

				if (strpos($value, 'estado') !== false) {
					$nomEdo = $contents['data'][0]['geometry']['features'][0]['properties']['nombreEdo'];
					$latEdo = $contents['latEdo'];
					$lngEdo = $contents['lngEdo'];
					$zoomEdo = $contents['zoomEdo'];
					$geometry = $contents['data'][0]['geometry']['features'][0]['geometry'];
					$idEdo = DB::table('geos.estados')->insertGetId(
						['code' => $edoCode, 'name' => $nomEdo, 'lat' => $latEdo, 'lng' => $lngEdo, 'zoom' => $zoomEdo, 'geometry' => json_encode($geometry)]
					);
				} else {
					foreach ($contents['data'] as $municipio) {
						$nomMun = $municipio['geometry']['features'][0]['properties']['nombreMun'];
						$geometry = $municipio['geometry']['features'][0]['geometry'];
						DB::table('geos.municipios')->insert(
							['id_estado' => $idEdo, 'name' => $nomMun, 'lat' => $latEdo, 'lng' => $lngEdo, 'zoom' => $zoomEdo, 'geometry' => json_encode($geometry)]
						);
					}
				}
    			echo 'Se insertó ' . $value . '<br>';
    		}
    	}
    }
}
