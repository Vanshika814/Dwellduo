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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->timestamps();   
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('budget')->nullable();
            $table->string('preferred_location')->nullable();
            $table->integer('cleanliness_level')->nullable();
            $table->string('lifestyle')->nullable();
            $table->string('sleeping_schedule')->nullable();
            $table->boolean('pet_friendly')->default(false);
            $table->boolean('smoking')->default(false);
            $table->boolean('drinking')->default(false);
            $table->text('hobbies')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
