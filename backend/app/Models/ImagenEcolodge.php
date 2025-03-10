<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenEcolodge extends Model
{
    use HasFactory;

    protected $fillable = [
        'ecolodge_id', 'ruta_imagen',
    ];

    // Relación con el ecolodge
    public function ecolodge()
    {
        return $this->belongsTo(Ecolodge::class);
    }
}