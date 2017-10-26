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
        $validation = Validator::make(
            $request->all(),
            [
                'name' => 'required|unique:zonas|string',
                'code' => 'required|unique:zonas|string|min:2|max:4',
                'lat' => 'required|numeric',
                'lng' => 'required|numeric|different:lat',
                'rad' => 'required|numeric'
            ],
            [
                'name.required' => 'El nombre del área es requerido',
                'name.unique' => 'Ese nombre de área ya existe',
                'name.string' => 'El nombre debe ser una cadena de texto',
                'code.required' => 'El código de área es requerido',
                'code.unique' => 'Ese código de área ya existe',
                'code.string' => 'El código de área debe ser texto',
                'code.min' => 'El código debe tener al menos dos caracteres',
                'code.max' => 'El código debe tener máximo cuatro caracteres',
                'lng.different' => 'Latitud y longitud no pueden ser las mismas para esta zona'
            ]
        );

        if ($validation->fails()) {
            return response()->json([
                'status' => 0,
                'errors' => $validation->errors()
            ]);
        }

        $city = new City($request->all());

        if ($city->save()) {
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

    public function updateCity(Request $request)
    {
        $array = $request->all();
        $id = array_pull($array, 'id');
        $validation = Validator::make(
            $request->all(),
            [
                'name' => 'required|unique:zonas,name,'.$id.'|string',
                'code' => 'required|unique:zonas,code,'.$id.'|string|min:2|max:4',
                'lat' => 'required|numeric',
                'lng' => 'required|numeric|different:lat',
                'rad' => 'required|numeric'
            ],
            [
                'name.required' => 'El nombre del área es requerido',
                'name.unique' => 'Ese nombre de área ya existe',
                'name.string' => 'El nombre debe ser una cadena de texto',
                'code.required' => 'El código de área es requerido',
                'code.unique' => 'Ese código de área ya existe',
                'code.string' => 'El código de área debe ser texto',
                'code.min' => 'El código debe tener al menos dos caracteres',
                'code.max' => 'El código debe tener máximo cuatro caracteres',
                'lng.different' => 'Latitud y longitud no pueden ser las mismas para esta zona'
            ]
        );

        if ($validation->fails()) {
            return response()->json([
                'status' => 0,
                'errors' => $validation->errors()
            ]);
        }

        $city = City::find($id);

        if ($city->update($array)) {
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
