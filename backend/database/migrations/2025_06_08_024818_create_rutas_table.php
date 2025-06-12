<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('rutas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ciudad_id')->constrained('ciudades')->onDelete('cascade');
            $table->string('nombre_ruta', 15);
            $table->enum('tipo_servicio', ['1', '2']); // 1=Personal, 2=Artículos
            $table->foreignId('chofer_id')->constrained('choferes')->onDelete('restrict');
            $table->integer('capacidad');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rutas');
    }
};
