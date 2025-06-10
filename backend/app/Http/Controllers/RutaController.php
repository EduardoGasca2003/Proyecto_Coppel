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

    public function index(Request $request)
    {
        $query = \App\Models\Ruta::with(['ciudad', 'chofer']);

        // Filtro por ciudad si viene en la request
        if ($request->has('ciudad_id')) {
            $query->where('ciudad_id', $request->input('ciudad_id'));
        }

        // Filtro por nombre de ruta si viene en la request
        if ($request->has('nombre_ruta')) {
            $query->where('nombre_ruta', 'LIKE', '%' . $request->input('nombre_ruta') . '%');
        }

        $rutas = $query->get();

        return response()->json($rutas);
    }

    public function update(Request $request, $id)
    {
        $ruta = Ruta::findOrFail($id);

        $request->validate([
            'chofer_id' => 'required|exists:choferes,id',
            'tipo_servicio' => 'required|string',
            'capacidad' => 'required|integer|min:1',
        ]);

        $ruta->update([
            'chofer_id' => $request->chofer_id,
            'tipo_servicio' => $request->tipo_servicio,
            'capacidad' => $request->capacidad,
        ]);

        return response()->json(['message' => 'Ruta actualizada correctamente', 'ruta' => $ruta]);
    }

    public function destroy($id)
    {
        $ruta = Ruta::findOrFail($id);
        $ruta->delete();

        return response()->json(['message' => 'Ruta eliminada correctamente']);
    }
}
