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
        $user = auth()->user();
        // Verifica si el usuario tiene el rol 'traveler'
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
            'energia_renovable' => 'boolean', // Asegúrate de validar este campo también si es necesario
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
    
        // Encontrar el ecolodge y verificar que pertenece al usuario
        $ecolodge = Ecolodge::where('id', $id)
            ->where('propietario_id', auth()->id())
            ->first();

        if (!$ecolodge) {
            return response()->json(['error' => 'Ecolodge no encontrado o no autorizado'], 404);
        }
    
        // Validar la información
        $request->validate([
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'nullable|numeric|min:0',
            'paneles_solares' => 'boolean',
            'energia_renovable' => 'boolean',
        ]);
    
        // Actualizar campos
        $ecolodge->update([
            'nombre' => $request->nombre,
            'ubicacion' => $request->ubicacion,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
            'paneles_solares' => $request->paneles_solares,
            'energia_renovable' => $request->energia_renovable,
        ]);
    
        return response()->json(['message' => 'Ecolodge actualizado', 'ecolodge' => $ecolodge]);
    }
    
    public function destroy($id)
    {
        // Verificar que el usuario tenga rol owner o both
        if (!in_array(auth()->user()->role, ['owner', 'both'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        // Buscar el ecolodge y verificar que pertenece al usuario
        $ecolodge = Ecolodge::where('id', $id)
            ->where('propietario_id', auth()->id())
            ->firstOrFail(); // Esto lanza una excepción si no se encuentra el ecolodge

        // Eliminar el ecolodge
        $ecolodge->delete();

        return response()->json(['message' => 'Ecolodge eliminado correctamente']);
    }

    public function filtrarEcolodges(Request $request)
    {
        $query = Ecolodge::query();

        if ($request->has('paneles_solares')) {
            $solar = filter_var($request->paneles_solares, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($solar)) {
                $query->where('paneles_solares', $solar);
            }
        }

        if ($request->has('energia_renovable')) {
            $energia = filter_var($request->energia_renovable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($energia)) {
                $query->where('energia_renovable', $energia);
            }
        }

        if (auth()->check()) {
            $query->where('propietario_id', auth()->id());
        } else {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $ecolodges = $query->get();

        if ($ecolodges->isEmpty()) {
            return response()->json(['message' => 'No se encontraron ecolodges con los filtros aplicados'], 404);
        }

        return response()->json($ecolodges);
    }

    public function show($id)
    {
        return Ecolodge::findOrFail($id);
    }
}
