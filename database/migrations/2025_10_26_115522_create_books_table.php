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
    public function up(): void
{
    Schema::create('books', function (Blueprint $table) {
        $table->uuid('id')->primary(); // UUID Primary Key
        $table->string('title', 200);
        $table->string('language', 50)->nullable();
        $table->integer('views_count')->default(0);
        $table->integer('download_count')->default(0);
        $table->string('author', 150);
        $table->string('publisher', 150)->nullable();
        $table->integer('year')->nullable();
        $table->string('isbn', 50)->nullable();

        // Foreign key ke categories
        // $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
        // Versi alternatif agar lebih sesuai skema SQL asli (SERIAL vs BIGINT)
        $table->unsignedInteger('category_id')->nullable(); 
        $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            
        $table->text('description')->nullable();
        $table->string('cover_path', 255)->nullable();
        $table->string('file_path', 255)->nullable();
        $table->timestamps();
        $table->softDeletes(); // Untuk "deleted_at"
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('books');
    }
};
