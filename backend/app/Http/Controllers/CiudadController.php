<?php

namespace App\Http\Controllers;

use App\Models\Ciudad;
use App\Http\Controllers\Controller;

class CiudadController extends Controller
{
    public function index()
    {
        return Ciudad::all(); // Devuelve todas las ciudades
    }
}
