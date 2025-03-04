<?php
namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ecolodge extends Model
{
    use HasFactory;
    protected $fillable = ['propietario_id', 'nombre', 'descripcion', 'ubicacion', 'precio', 'disponible', 'paneles_solares'];

    public function propietario()
    {
        return $this->belongsTo(User::class, 'propietario_id');
    }
}
