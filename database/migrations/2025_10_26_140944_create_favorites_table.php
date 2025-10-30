<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('favorites', function (Blueprint $table) {
    $table->id();
    $table->uuid('user_id'); // FK ke users.id (UUID)
    $table->uuid('book_id'); // FK ke books.id (UUID)
    $table->timestamps();

    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');

    // Memastikan satu user hanya bisa memfavoritkan satu buku sekali
    $table->unique(['user_id', 'book_id']); 
});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('favorites');
    }
};
