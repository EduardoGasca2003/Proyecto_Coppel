<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CiudadController;
use App\Http\Controllers\ChoferController;
use App\Http\Controllers\RutaController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/prueba', function () {
    return response()->json(
        'Quibo Prros!'
    );
});

Route::get('/ciudades', [CiudadController::class, 'index']);
Route::get('/choferes/{ciudad_id}', [ChoferController::class, 'index']);
Route::post('/choferes', [ChoferController::class, 'store']);

Route::get('/rutas', [RutaController::class, 'index']);
Route::post('/rutas', [RutaController::class, 'store']);
