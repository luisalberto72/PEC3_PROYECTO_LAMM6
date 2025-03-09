<?php

namespace App\Http\Controllers;

use App\Models\Ecolodge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EcolodgeController extends Controller
{
    public function index(Request $request)
    {
        $query = Ecolodge::query();

        if ($request->has('paneles_solares')) {
            $query->where('paneles_solares', $request->paneles_solares);
        }

        if ($request->has('ubicacion')) {
            $query->where('ubicacion', 'LIKE', "%{$request->ubicacion}%");
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
            // Obtén el usuario autenticado
    $user = Auth::user();
    // Verifica si el usuario tiene el rol 'owner'
    if ($user->role == 'traveler') {
        return response()->json(['error' => 'Acción no permitida: solo los propietarios o both pueden agregar un ecolodge.'], 403);
    }

        $validatedData = $request->validate([
            'nombre' => 'required|unique:ecolodges',
            'descripcion' => 'required',
            'ubicacion' => 'required',
            'precio' => 'required|numeric',
            'disponible' => 'boolean',
            'paneles_solares' => 'boolean',
        ]);
      
        $validatedData['propietario_id'] = $user->id; // Tomamos el ID del usuario autenticado
    
        $ecolodge = Ecolodge::create($validatedData);
    
        return response()->json($ecolodge, 201);
    }
    
    public function update(Request $request, $id)
    {
        // Verificar que el usuario tenga rol owner o both
        if (!in_array(auth()->user()->role, ['owner', 'both'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }
    
        // Encontrar el ecolodge y verificar que pertenece al usuario (utilizando 'propietario_id' en lugar de 'user_id')
        $ecolodge = Ecolodge::where('id', $id)
            ->where('propietario_id', auth()->id()) // Verifica que el propietario sea el usuario autenticado
            ->first();
    
        if (!$ecolodge) {
            return response()->json(['error' => 'Ecolodge no encontrado o no autorizado'], 404);
        }
    
        // Validar la información
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'nullable|numeric|min:0',
            'has_solar_panels' => 'boolean',
            'is_available' => 'boolean',
        ]);
    
        // Actualizar campos
        $ecolodge->update([
            'nombre' => $request->name,  // Asegúrate de que el nombre del campo sea 'nombre' en lugar de 'name'
            'ubicacion' => $request->location,  // Asegúrate de que el nombre del campo sea 'ubicacion' en lugar de 'location'
            'descripcion' => $request->description,  // Asegúrate de que el nombre del campo sea 'descripcion' en lugar de 'description'
            'precio' => $request->price_per_night,  // Asegúrate de que el nombre del campo sea 'precio' en lugar de 'price_per_night'
            'paneles_solares' => $request->has_solar_panels,  // Asegúrate de que el nombre del campo sea 'paneles_solares' en lugar de 'has_solar_panels'
            'disponible' => $request->is_available,  // Asegúrate de que el nombre del campo sea 'disponible' en lugar de 'is_available'
        ]);
    
        return response()->json(['message' => 'Ecolodge actualizado', 'ecolodge' => $ecolodge]);
    }
    
public function destroy($id)
{
    // Verificar que el usuario tenga rol owner o both
    if (!in_array(auth()->user()->role, ['owner', 'both'])) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    // Buscar el ecolodge y verificar que pertenece al usuario autenticado
    $ecolodge = Ecolodge::where('id', $id)
        ->where('propietario_id', auth()->id())
        ->firstOrFail(); // Esto lanza una excepción si no se encuentra el ecolodge

    // Eliminar el ecolodge
    $ecolodge->delete();

    // Responder con éxito
    return response()->json(['message' => 'Ecolodge eliminado correctamente']);
}

public function filtrarEcolodges(Request $request)
{
    // Inicia la consulta
    $query = Ecolodge::query();

    // Filtrar por paneles solares si el parámetro está presente
    if ($request->filled('paneles_solares')) {
        $query->where('paneles_solares', $request->paneles_solares);
    }

    // Filtrar por disponibilidad si el parámetro está presente
    if ($request->filled('disponible')) {
        $query->where('disponible', $request->disponible);
    }

    // Verificar si el usuario está autenticado
    if (auth()->check()) {
        // Filtrar por el ID del propietario (usuario autenticado)
        $query->where('propietario_id', auth()->id());
    } else {
        // Si el usuario no está autenticado, devolver error
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }

    // Obtener resultados
    $ecolodges = $query->get();

    // Si no se encuentran ecolodges para el usuario, devolver mensaje adecuado
    if ($ecolodges->isEmpty()) {
        return response()->json(['message' => 'No se encontraron ecolodges para este usuario'], 404);
    }

    // Devolver resultados como JSON
    return response()->json($ecolodges);
}


}