<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ruta extends Model
{
    use HasFactory;

    protected $fillable = [
        'ciudad_id',
        'nombre_ruta',
        'tipo_servicio',
        'chofer_id',
        'capacidad'
    ];

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    public function chofer()
    {
        return $this->belongsTo(Chofer::class);
    }
}
