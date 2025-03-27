<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Opinion extends Model
{
    // Indicar que el nombre de la tabla es 'opiniones'
    protected $table = 'opiniones';

    protected $fillable = [
        'ecolodge_id',
        'viajero_id',
        'calificacion',
        'comentario',
        'ecolodge_nombre',  // Añadir estos campos para la asignación masiva
        'viajero_nombre',
    ];

    // Relación con Ecolodge
    public function ecolodge()
    {
        return $this->belongsTo(Ecolodge::class, 'ecolodge_id');
    }

    // Relación con Viajero (User)
    public function viajero()
    {
        return $this->belongsTo(User::class, 'viajero_id');
    }
}
