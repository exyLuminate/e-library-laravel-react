<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// 👇 1. Tambahkan use statement untuk seeder Anda 👇
use Database\Seeders\CategorySeeder; // Asumsi Anda punya seeder ini
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\BookSeeder;
// 👆 --- 👆

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // 👇 2. Panggil seeder Anda di sini 👇
        $this->call([
            CategorySeeder::class,    // Jalankan seeder kategori dulu
            AdminUserSeeder::class,   // Jalankan seeder admin
            BookSeeder::class,      // Jalankan seeder buku (yang akan membuat 100 buku)
        ]);
        // 👆 --- 👆
    }
}