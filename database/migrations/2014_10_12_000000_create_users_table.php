<?php
// database/migrations/...._create_users_table.php

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
        Schema::create('users', function (Blueprint $table) {
            // Menggunakan ->primary() akan membuat Laravel paham ini Primary Key
            // Kita akan gunakan Trait HasUuids di model untuk auto-generate
            $table->uuid('id')->primary(); 
            $table->string('name', 100);
            $table->string('email', 150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role', 20)->default('user'); // CHECK constraint bisa ditambahkan via DB::statement jika perlu, tapi default ini cukup
            $table->rememberToken(); // Diperlukan oleh Laravel Auth
            $table->timestamps(); // (created_at, updated_at)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};