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
        Schema::create('rating_and_reviews', function (Blueprint $table) {
    $table->id();
    $table->uuid('user_id'); // FK ke users.id (UUID)
    $table->uuid('book_id'); // FK ke books.id (UUID)
    $table->integer('rating')->unsigned()->default(0); // 1 sampai 5
    $table->text('review')->nullable();
    $table->timestamps();

    $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');

    // Memastikan satu user hanya bisa me-review satu buku sekali
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
        Schema::dropIfExists('rating_and_reviews');
    }
};
