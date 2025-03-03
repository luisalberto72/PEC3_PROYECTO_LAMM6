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
        Schema::create('houses', function (Blueprint $table) {
            $table->id();
            $table->string('Title');
            $table->string('Price');
            $table->string('City');
            $table->string('Address');
            $table->string('Email');
            $table->string('Phone_number')->nullable();
            $table->text('Description');
            $table->string('Status');
            $table->string('Type');
            $table->string('HouseImage1');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('houses');
    }
};
