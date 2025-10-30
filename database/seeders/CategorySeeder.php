<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category; // <-- Import model Category
use Illuminate\Support\Facades\DB; // <-- Import DB facade (opsional, untuk truncate)

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama (opsional, hati-hati jika sudah ada data penting)
        // DB::table('categories')->truncate(); 

        // Tambahkan beberapa kategori contoh
        Category::create(['name' => 'Sains']);
        Category::create(['name' => 'Novel']);
        Category::create(['name' => 'Komedi']);
        Category::create(['name' => 'Fantasi']);
        Category::create(['name' => 'Sejarah']);
        Category::create(['name' => 'Teknologi']);
        Category::create(['name' => 'Biografi']);

        $this->command->info('Category table seeded!'); // Pesan di terminal
    }
}