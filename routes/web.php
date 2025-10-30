<?php

use App\Http\Controllers\PublicController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BookController; // Admin Book Controller (CRUD)
use App\Http\Controllers\BookController as PublikBookController; // Public Book Controller (Show, Index)
use App\Http\Controllers\FavoriteController; 
use App\Http\Controllers\DashboardController; 
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\RatingAndReviewController; // <-- BARU: Untuk menyimpan ulasan
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Rute Home (Landing Page)
// Kita menggunakan PublicController@index untuk memuat data buku & filter
Route::get('/', [PublicController::class, 'index'])->name('home');

// Rute yang membutuhkan Autentikasi
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Rute Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rute Profil Pengguna (Breeze Default)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Publik dengan Autentikasi
    
    // Rute Detail Buku (Menggunakan PublikBookController)
    Route::get('/books/{book}', [PublikBookController::class, 'show'])->name('books.show');
    
    // Rute Aksi: Toggle Favorit
    Route::post('/books/{book}/favorite/toggle', [FavoriteController::class, 'toggle'])->name('books.favorite.toggle');
    
    // Rute Aksi: Simpan Ulasan dan Rating (BARU)
    Route::post('/books/{book}/review', [RatingAndReviewController::class, 'store'])->name('reviews.store');

    // Rute untuk Mengunduh/Membaca File
    // Asumsi: 'downloadOrRead' ada di PublikBookController
    Route::get('/books/{book}/file', [PublikBookController::class, 'downloadOrRead'])->name('books.file');
});


// Rute Admin (Membutuhkan Autentikasi, Verifikasi Email, dan Middleware 'admin')
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    
    // Rute untuk Dashboard Admin
    Route::get('/', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    // Rute Resource untuk Buku (Menggunakan Admin\BookController)
    Route::resource('books', BookController::class)->names('admin.books');
    
    // Rute Resource untuk Kategori
    Route::resource('categories', CategoryController::class)->names('admin.categories');
});

require __DIR__.'/auth.php';