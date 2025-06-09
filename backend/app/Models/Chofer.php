<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chofer extends Model
{
    use HasFactory;

    protected $fillable = [
        'ciudad_id',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'sueldo',
        'activo'
    ];

    // Un chofer pertenece a una ciudad
    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    // Un chofer puede tener una ruta asignada
    public function ruta()
    {
        return $this->hasOne(Ruta::class);
    }
}
