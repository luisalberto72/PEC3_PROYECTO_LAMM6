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
        $user = auth()->user();
    
        if (!in_array($user->role, ['owner', 'both'])) {
            return response()->json(['error' => 'No tienes permisos para agregar ecolodges'], 403);
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
    
}