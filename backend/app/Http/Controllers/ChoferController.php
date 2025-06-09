<?php

namespace App\Http\Controllers;

use App\Models\Chofer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ChoferController extends Controller
{
    // Choferes activos por ciudad
    public function index($ciudad_id)
    {
        $choferes = Chofer::where('ciudad_id', $ciudad_id)
            ->where('activo', true)
            ->get();

        if ($choferes->isEmpty()) {
            return response()->json(['mensaje' => 'No hay choferes disponibles.'], 404);
        }

        return $choferes;
    }

    // Registrar chofer
    public function store(Request $request)
    {
        $request->validate([
            'ciudad_id' => 'required|exists:ciudades,id',
            'nombre' => 'required|alpha|max:15',
            'apellido_paterno' => 'required|alpha|max:15',
            'apellido_materno' => 'required|alpha|max:15',
            'fecha_nacimiento' => 'required|date|before:-18 years',
            'sueldo' => 'required|numeric|min:0'
        ]);

        $chofer = Chofer::create(array_merge(
            $request->all(),
            ['activo' => true]
        ));

        return response()->json($chofer, 201);
    }
}
