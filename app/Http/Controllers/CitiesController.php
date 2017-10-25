<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Validator;

use App\City;

class CitiesController extends Controller
{
    public function getAll()
    {
    	return response()->json(['data' => City::all()]);
    }

    public function getCity($code)
    {
    	return response()->json(['data' => City::where('code', $code)->get()]);
    }

    public function storeCity(Request $request)
    {
    	$validation = Validator::make($request->all(), [
			'name' 		=> 'required|unique:cities|string',
			'code' 		=> 'required|unique:cities|string|max:4',
			'polygon' 	=> 'required|unique:cities|string'
    	]);

    	if ($validation->fails()) {
    		return response()->json([
    			'status' => 0,
    			'errors' => $validation->errors()
    		]);
    	}

    	if ($city = new City($request->all())) {
    		return response()->json([
    			'status' => 1,
    			'city' => $city 
    		]);
    	}
    	return response()->json([
    		'status' => 0,
    		'message' => 'Error al guardar'
    	]);
    }
}
