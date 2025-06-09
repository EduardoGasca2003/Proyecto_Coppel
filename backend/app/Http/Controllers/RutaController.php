<?php

namespace App\Http\Controllers;

use App\Models\Ruta;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RutaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ciudad_id' => 'required|exists:ciudades,id',
            'nombre_ruta' => 'required|alpha_num|max:15',
            'tipo_servicio' => 'required|in:1,2',
            'chofer_id' => 'required|exists:choferes,id',
            'capacidad' => 'required|numeric|min:1',
        ]);

        // Validación personalizada de capacidad
        if ($request->tipo_servicio == 1 && $request->capacidad > 34) {
            return response()->json(['mensaje' => 'Capacidad máxima para servicio Personal: 34'], 422);
        }

        if ($request->tipo_servicio == 2 && $request->capacidad > 100) {
            return response()->json(['mensaje' => 'Capacidad máxima para servicio Artículos: 100'], 422);
        }

        $ruta = Ruta::create($request->all());

        return response()->json($ruta, 201);
    }

    public function index()
    {
        return Ruta::with('ciudad', 'chofer')->get();
    }
}
