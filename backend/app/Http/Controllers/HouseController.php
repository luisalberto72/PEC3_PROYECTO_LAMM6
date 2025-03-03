<?php

// app/Http/Controllers/HouseController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\House;
use Illuminate\Support\Facades\Validator;

class HouseController extends Controller
{
    public function store(Request $request)
    {
        // Validación de los datos recibidos
        $validator = Validator::make($request->all(), [
            'Title' => 'required|string|max:255',
            'Price' => 'required|string|max:255',
            'City' => 'required|string|max:255',
            'Address' => 'required|string|max:255',
            'Email' => 'required|email',
            'Phone_number' => 'nullable|string|max:255',
            'Description' => 'required|string',
            'Status' => 'required|string',
            'Type' => 'required|string',
            'HouseImage1' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_id' => 'required|exists:users,id'
        ]);

        // Si la validación falla, devuelve el error
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Guardar la imagen
        $imagePath = $request->file('HouseImage1')->store('house_images', 'public');

        // Crear el registro de la propiedad
        $house = House::create([
            'Title' => $request->Title,
            'Price' => $request->Price,
            'City' => $request->City,
            'Address' => $request->Address,
            'Email' => $request->Email,
            'Phone_number' => $request->Phone_number,
            'Description' => $request->Description,
            'Status' => $request->Status,
            'Type' => $request->Type,
            'HouseImage1' => $imagePath, // Guardar el path de la imagen
            'user_id' => $request->user_id,
        ]);

        // Responder con éxito
        return response()->json(['message' => 'Property added successfully', 'house' => $house], 201);
    }
}
