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

        return response()->json($choferes);
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

    public function update(Request $request, $id)
    {
        $chofer = Chofer::findOrFail($id);

        $request->validate([
            'sueldo' => 'required|numeric|min:0',
            'activo' => 'required|boolean',
        ]);

        $chofer->update([
            'sueldo' => $request->sueldo,
            'activo' => $request->activo,
        ]);

        return response()->json([
            'mensaje' => 'Chofer actualizado correctamente.',
            'chofer' => $chofer
        ]);
    }

    // DELETE: Eliminar chofer
    public function destroy($id)
    {
        $chofer = Chofer::findOrFail($id);
        $chofer->delete();

        return response()->json(['mensaje' => 'Chofer eliminado correctamente.']);
    }
}
