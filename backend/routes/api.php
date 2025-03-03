<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\userController;
use App\Http\Controllers\Message;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\FavouritController;




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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/Register',[userController::class,'Register']);
Route::post('/Login',[userController::class,'Login']);


Route::post('/ResetPass',[userController::class,'forgotPassword']);
Route::post('/createRent',[HouseController::class,'CreateProperty']);
Route::post('/updateRent/{id}',[HouseController::class,'updateRent']);

Route::get('/GetAll',[HouseController::class,'GetAll']);
Route::get('/Delete/{id}',[HouseController::class,'deleteHouse']);
Route::get('/GetDetails/{id}',[HouseController::class,'findMyRenting']);
Route::get('/MyCreated/{id}',[HouseController::class,'MyCreated']);
Route::get('/usernumbers/{id}',[HouseController::class,'numerofposts_and_favourits']);
Route::post('/Favourite',[FavouritController::class,'AddFavourit']);




Route::post('/Search',[HouseController::class,'search']);
Route::post('/UserUpdate/{id}',[userController::class,'updateUser']);
Route::get('/userinfo/{id}',[userController::class,'userinfo']);
Route::post('/TokenTest',[userController::class,'ValidateToken']);

Route::patch('/usuarios/{id}/perfil', [userController::class, 'updateUser']);


Route::post('/update-profile-picture/{id}', [UserController::class, 'updateProfilePicture']);











