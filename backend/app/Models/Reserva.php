<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $fillable = [
        'ecolodge_id', 'viajero_id', 'fecha_inicio', 'fecha_fin', 'estado', 'precio_total'
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