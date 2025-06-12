<?php

namespace App\Http\Controllers;

use App\Models\Chofer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ChoferController extends Controller
{
    public function todos()
    {
        $choferes = Chofer::get();

        if ($choferes->isEmpty()) {
            return response()->json(['mensaje' => 'No hay choferes en la base de datos.'], 404);
        }

        return response()->json($choferes);
    }

    public function index($ciudad_id)
    {
        $choferes = Chofer::where('ciudad_id', $ciudad_id)
            ->get();

        if ($choferes->isEmpty()) {
            return response()->json(['mensaje' => 'No hay choferes disponibles.'], 404);
        }

        return response()->json($choferes);
    }


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
            $request->all()
        ));

        return response()->json($chofer, 201);
    }

    public function update(Request $request, $id)
    {
        $chofer = Chofer::findOrFail($id);

        $request->validate([
            'fecha_nacimiento' => 'required|date|before:-18 years',
            'sueldo' => 'required|numeric|min:0',
        ]);

        $chofer->update([
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'sueldo' => $request->sueldo,
        ]);

        return response()->json([
            'mensaje' => 'Chofer actualizado correctamente.',
            'chofer' => $chofer
        ]);
    }

    public function destroy($id)
    {
        $chofer = Chofer::findOrFail($id);
        $chofer->delete();

        return response()->json(['mensaje' => 'Chofer eliminado correctamente.']);
    }

    public function obtenerCiudadYRuta($id)
    {
        try {
            $resultado = DB::select('CALL ObtenerCiudadYRutaChofer(?)', [$id]);

            if (empty($resultado)) {
                return response()->json(['message' => 'Chofer no encontrado'], 404);
            }

            return response()->json($resultado[0]); // Retorna el primer (y único) resultado
        } catch (\Exception $e) {
            return response()->json(['error, fallo el procedimiento almacenado' => $e->getMessage()], 500);
        }
    }
}
