<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RutaController;
use App\Http\Controllers\ChoferController;
use App\Http\Controllers\CiudadController;

Route::apiResource('rutas', RutaController::class);
Route::get('/rutas', [RutaController::class, 'index']);
Route::post('/rutas', [RutaController::class, 'store']);
Route::put('/rutas/{id}', [RutaController::class, 'update']);
Route::delete('/rutas/{id}', [RutaController::class, 'destroy']);

Route::get('/ciudades', [CiudadController::class, 'index']);
Route::post('/ciudades', [CiudadController::class, 'store']);
Route::put('/ciudades/{id}', [CiudadController::class, 'update']);
Route::delete('/ciudades/{id}', [CiudadController::class, 'destroy']);
Route::delete('/ciudades/eliminar/{nombre}', [CiudadController::class, 'eliminarPorNombre']);

Route::get('/choferes', [ChoferController::class, 'todos']);
Route::get('/choferes/ciudad/{ciudad_id}', [ChoferController::class, 'index']);
Route::post('/choferes', [ChoferController::class, 'store']);
Route::put('/choferes/{id}', [ChoferController::class, 'update']);
Route::delete('/choferes/{id}', [ChoferController::class, 'destroy']);

Route::get('/choferes/{id}/info', [ChoferController::class, 'obtenerCiudadYRuta']);
Route::get('/rutas/detalle/{id}', [RutaController::class, 'obtenerRutaYCiudad']);
