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
   // ...
public function up(): void
{
    Schema::create('ratings', function (Blueprint $table) {
        $table->id(); // SERIAL PRIMARY KEY
        
        // Foreign key ke users (UUID)
        $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
        
        // Foreign key ke books (UUID)
        $table->foreignUuid('book_id')->constrained('books')->onDelete('cascade');
        
        $table->smallInteger('rating'); // Validasi 1-5 akan dilakukan di level aplikasi
        $table->text('comment')->nullable();
        $table->timestamps();

        // CONSTRAINT unique_user_book
        $table->unique(['user_id', 'book_id']);
    });
}
// ...

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ratings');
    }
};
