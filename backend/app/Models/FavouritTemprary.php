<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavouritTemprary extends Model
{
    use HasFactory;
    protected $fillable = [
        'Titile',
        'Price',
        'City',
        'Adresse',
        'Emaile',
        'Phone_number',
        'Description',
        'Status',
        'Type',
        'ResntalPeriod',
        'latitude',
        'longitude',
        'HouseImage1',
        'user_id'
    ];
}
