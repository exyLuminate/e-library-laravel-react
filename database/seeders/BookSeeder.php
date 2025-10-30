<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Book; // Import model Book

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data buku lama sebelum mengisi (opsional)
        // Book::truncate(); // Hati-hati jika sudah ada data penting

        // Buat 100 buku menggunakan factory
        Book::factory()->count(100)->create();

        $this->command->info('Successfully seeded 100 dummy books.');
    }
}