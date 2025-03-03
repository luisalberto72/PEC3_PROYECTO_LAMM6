<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favourit_tempraries', function (Blueprint $table) {
            $table->id();
            $table->string('Titile');
            $table->string('Price');
            $table->string('City');
            $table->string('Adresse');
            $table->string('Emaile');
            $table->string('Phone_number')->nullable();
            $table->longText('Description');
            $table->string('Status');
            $table->string('Type');
            $table->string('ResntalPeriod')->nullable();
            $table->string('latitude');
            $table->string('longitude');
            $table->string('HouseImage1');
            $table->string('HouseImage2')->nullable();
            $table->string('HouseImage3')->nullable();
            $table->string('HouseImage4')->nullable();
            $table->string('HouseImage5')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favourit_tempraries');
    }
};
