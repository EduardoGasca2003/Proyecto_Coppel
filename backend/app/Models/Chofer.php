<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chofer extends Model
{
    use HasFactory;

    protected $table = 'choferes'; // nombre de la tabla en la base de datos pa que el laravel no se aloque tambien

    protected $fillable = [
        'ciudad_id',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'sueldo'

    ];

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }
}
