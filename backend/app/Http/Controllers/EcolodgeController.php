<?php

namespace App\Http\Controllers;

use App\Models\Ecolodge;
use App\Models\ImagenEcolodge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
        // Obtener el usuario autenticado
        $user = auth()->user();
    
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
    
        // Validación de los datos
        $validatedData = $request->validate([
            'nombre' => 'required|unique:ecolodges',
            'descripcion' => 'required',
            'ubicacion' => 'required',
            'precio' => 'required|numeric',
            'energia_renovable' => 'required|boolean',
            'paneles_solares' => 'required|boolean',
            'imagenes' => 'required|array', // Asegurar que imágenes es un arreglo
            'imagenes.*' => 'image|mimes:jpeg,png,jpg,gif,svg', // Validación de tipo de archivo
        ]);
    
        // Crear el Ecolodge con el propietario autenticado
        $ecolodge = Ecolodge::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'ubicacion' => $validatedData['ubicacion'],
            'precio' => $validatedData['precio'],
            'energia_renovable' => $validatedData['energia_renovable'],
            'paneles_solares' => $validatedData['paneles_solares'],
            'propietario_id' => $user->id, // Usamos el ID del usuario autenticado
        ]);
    
        // Subir las imágenes
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                if ($imagen->isValid()) {
                    $path = $imagen->store('public/Houses/image');
    
                    // Guardar la ruta en la tabla de imágenes relacionadas
                    $ecolodge->imagenes()->create([
                        'ruta_imagen' => $path,
                    ]);
                }
            }
        } else {
            return response()->json(['error' => 'Se requieren imágenes'], 400);
        }
    
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
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'nullable|numeric|min:0',
            'paneles_solares' => 'boolean',
            'energia_renovable' => 'boolean',
            'imagenes' => 'array', // Para las imágenes
            'imagenes.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validación de imagen
        ]);
    
        // Actualizar campos
        $ecolodge->update($validatedData);
    
        // Subir nuevas imágenes si es necesario
        if ($request->has('imagenes')) {
            foreach ($request->imagenes as $image) {
                $path = $image->store('ecolodge_images', 'public');
                // Relacionar la nueva imagen con el ecolodge
                ImagenEcolodge::create([
                    'ecolodge_id' => $ecolodge->id,
                    'ruta_imagen' => $path,
                ]);
            }
        }

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

        // Eliminar las imágenes relacionadas
        $ecolodge->imagenes()->delete(); // Eliminar las imágenes relacionadas

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
        $ecolodge = Ecolodge::findOrFail($id);
        // Obtener imágenes relacionadas
        $ecolodge->imagenes;
        return response()->json($ecolodge);
    }
}
