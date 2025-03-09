<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;



use App\Http\Controllers\EcolodgeController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['jwt.auth'])->get('/user', function (Request $request) {
    return response()->json($request->user());
});

// Rutas públicas (sin autenticación)
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/ResetPass', [UserController::class, 'forgotPassword']);

// Validar token (puede ser útil para depuración)
Route::post('/TokenTest', [UserController::class, 'ValidateToken']);

// Middleware de autenticación JWT
Route::middleware(['jwt.auth'])->group(function () {
    // Rutas protegidas de ecolodges
    Route::post('/ecolodges', [EcolodgeController::class, 'store']);
    Route::get('/ecolodges', [EcolodgeController::class, 'index']);

    // Refrescar token JWT
    Route::post('/refresh-token', [UserController::class, 'refreshToken']);
});
   
Route::get('/userinfo/{id}', [UserController::class, 'userinfo']);

Route::post('/UserUpdate/{id}', [UserController::class, 'updateUser']);
Route::post('/update-profile-picture/{id}', [UserController::class, 'updateProfilePicture']);

// Actualizar un Ecolodge
Route::middleware('auth:api')->put('/ecolodges/{id}', [EcolodgeController::class, 'update']);

// Eliminar un Ecolodge
Route::middleware('auth:api')->delete('ecolodges/{id}', [EcolodgeController::class, 'destroy']);



// Filtro avanzado
Route::middleware('auth:api')->get('/ecolodges-filtrar', [EcolodgeController::class, 'filtrarEcolodges']);

