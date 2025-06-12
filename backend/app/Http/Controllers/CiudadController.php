<?php

namespace App\Http\Controllers;

use App\Models\Ciudad;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CiudadController extends Controller
{
    public function index()
    {
        $ciudades = Ciudad::all();

        if ($ciudades->isEmpty()) {
            return response()->json(['mensaje' => 'No hay ciudades registradas.'], 404);
        }

        return response()->json($ciudades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|alpha|max:30|unique:ciudades,nombre',
        ]);

        $ciudad = Ciudad::create([
            'nombre' => $request->nombre,
        ]);

        return response()->json($ciudad, 201);
    }

    public function destroy($id)
    {
        $ciudad = Ciudad::find($id);

        if (!$ciudad) {
            return response()->json(['mensaje' => 'Ciudad no encontrada.'], 404);
        }

        // Verifica si hay choferes o rutas asociadas
        $tieneChoferes = $ciudad->choferes()->exists();
        $tieneRutas = $ciudad->rutas()->exists();

        if ($tieneChoferes || $tieneRutas) {
            return response()->json([
                'mensaje' => 'No se puede eliminar la ciudad porque tiene choferes o rutas asociadas.'
            ], 409);
        }

        $ciudad->delete();

        return response()->json(['mensaje' => 'Ciudad eliminada correctamente.']);
    }
    public function eliminarPorNombre($nombre)
    {
        $ciudad = Ciudad::where('nombre', $nombre)->first();
        if (!$ciudad) {
            return response()->json(['message' => 'Ciudad no encontrada'], 404);
        }

        $ciudad->delete();
        return response()->json(['message' => 'Ciudad eliminada correctamente']);
    }
}
