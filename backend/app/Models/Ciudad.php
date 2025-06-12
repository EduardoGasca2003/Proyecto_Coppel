<?php

namespace App\Models;

use App\Models\Chofer;
use App\Models\Ruta;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ciudad extends Model
{
    use HasFactory;

    protected $table = 'ciudades'; // nombre de la tabla en la base de datos pa que el laravel no se aloque
    protected $fillable = ['nombre'];

    public function rutas()
    {
        return $this->hasMany(Ruta::class);
    }

    public function choferes()
    {
        return $this->hasMany(Chofer::class);
    }
}
