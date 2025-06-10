<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ciudad extends Model
{
    use HasFactory;

    protected $table = 'ciudades'; // nombre de la tabla en la base de datos pa que el laravel no se aloque
    protected $fillable = ['nombre']; // permite asignación masiva de este campo

    // Una ciudad puede tener muchas rutas
    public function rutas()
    {
        return $this->hasMany(Ruta::class);
    }

    // Una ciudad puede tener muchos choferes
    public function choferes()
    {
        return $this->hasMany(Chofer::class);
    }
}
