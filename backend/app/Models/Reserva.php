<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; // Asegúrate de que esta línea esté presente

class Reserva extends Model
{
    public function ecolodge()
    {
        return $this->belongsTo(Ecolodge::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
