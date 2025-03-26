<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Opinion;
use App\Models\Ecolodge;
use App\Models\User;

class OpinionController extends Controller
{
  

    // Método para guardar una opinión
    public function guardarOpinion(Request $request)
    {
        // Validación de los datos recibidos
        $validator = \Validator::make($request->all(), [
            'ecolodge_id' => 'required|exists:ecolodges,id',
            'viajero_id' => 'required|exists:users,id',
            'calificacion' => 'required|integer|min:1|max:5',
            'comentario' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'error' => 'Error en la validación de datos',
                'detalles' => $validator->errors()
            ], 422);
        }
    
        try {
            $opinion = Opinion::create($request->all());
            return response()->json(['success' => 'Opinión guardada correctamente.', 'opinion' => $opinion], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al guardar la opinión', 'detalle' => $e->getMessage()], 500);
        }
    }
    
    // Método para obtener todas las opiniones (usado para cargar opiniones en el frontend)
    public function obtenerOpiniones()
{
    try {
        $opiniones = Opinion::with(['ecolodge', 'viajero'])
            ->get()
            ->map(function ($opinion) {
                // Concatenar el nombre completo del viajero
                $opinion->viajero_nombre = $opinion->viajero->first_name . ' ' . $opinion->viajero->last_name;
                
                // Obtener solo el nombre del ecolodge (si es necesario)
                $opinion->ecolodge_nombre = $opinion->ecolodge->nombre;

                return $opinion;
            });
        
        return response()->json($opiniones);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al obtener las opiniones', 'detalle' => $e->getMessage()], 500);
    }
}

}
