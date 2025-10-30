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
    Schema::create('reads', function (Blueprint $table) {
        $table->id(); // SERIAL PRIMARY KEY
        
        // Foreign key ke users (UUID)
        $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
        
        // Foreign key ke books (UUID)
        $table->foreignUuid('book_id')->constrained('books')->onDelete('cascade');
        
        $table->timestamp('read_at')->useCurrent(); // Sesuai "DEFAULT NOW()"
        $table->string('action_type', 20)->nullable(); // Misal: 'view' atau 'download'
        $table->text('user_agent')->nullable();
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
        Schema::dropIfExists('reads');
    }
};
