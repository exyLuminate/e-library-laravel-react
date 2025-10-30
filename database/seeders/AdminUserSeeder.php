<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash; // <-- Tambahkan import Hash

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Akun Admin Utama (jika belum ada)
        User::firstOrCreate(
            ['email' => 'admin@elibrary.test'], // Kunci untuk mencari
            [ // Data yang akan dibuat jika email tidak ditemukan
                'name' => 'Admin Utama E-Library',
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Hash password 'password'
                'role' => 'admin',
            ]
        );

        // 2. Buat Akun Admin Tambahan 1 (jika belum ada)
        User::firstOrCreate(
            ['email' => 'admin1@elibrary.test'],
            [
                'name' => 'Admin Satu',
                'email_verified_at' => now(),
                'password' => Hash::make('adminpass1'), // Ganti password sesuai keinginan
                'role' => 'admin',
            ]
        );

        // 3. Buat Akun Admin Tambahan 2 (jika belum ada)
        User::firstOrCreate(
            ['email' => 'admin2@elibrary.test'],
            [
                'name' => 'Admin Dua',
                'email_verified_at' => now(),
                'password' => Hash::make('adminpass2'), // Ganti password sesuai keinginan
                'role' => 'admin',
            ]
        );

        // 4. Buat Akun Admin Tambahan 3 (jika belum ada)
        User::firstOrCreate(
            ['email' => 'admin3@elibrary.test'],
            [
                'name' => 'Admin Tiga',
                'email_verified_at' => now(),
                'password' => Hash::make('adminpass3'), // Ganti password sesuai keinginan
                'role' => 'admin',
            ]
        );

        $this->command->info('Admin users created successfully (if they did not exist).'); // Pesan di terminal
    }
}