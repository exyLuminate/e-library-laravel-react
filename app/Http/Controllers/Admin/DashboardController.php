<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use App\Models\RatingAndReview;
use Illuminate\Support\Facades\DB; // <-- PENTING: Tambahkan ini

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil data untuk Kartu Statistik (Kode Anda sebelumnya)
        $totalBooks = Book::count();
        $totalCategories = Category::count();
        $totalUsers = User::where('role', 'user')->count();
        $totalDownloads = Book::sum('download_count');
        $totalViews = Book::sum('views_count');
        $avgRating = RatingAndReview::avg('rating');

        // 2. Ambil data untuk Daftar (Kode Anda sebelumnya)
        $popularBooks = Book::orderBy('views_count', 'desc')
                            ->take(5)
                            ->get(['id', 'title', 'views_count']);

        // 3. --- TAMBAHAN BARU UNTUK CHART ---
        $ratingCounts = RatingAndReview::query()
            ->select('rating', DB::raw('count(*) as total'))
            ->groupBy('rating')
            ->pluck('total', 'rating')
            ->all(); // Konversi ke array asosiatif [ 1 => 10, 2 => 5, ...]

        // Siapkan data agar urut (1-5), dan pastikan ada nilai 0 jika rating tidak ada
        $ratingChartData = [
            'labels' => ['⭐ Bintang 1', '⭐⭐ Bintang 2', '⭐⭐⭐ Bintang 3', '⭐⭐⭐⭐ Bintang 4', '⭐⭐⭐⭐⭐ Bintang 5'],
            'data' => [
                $ratingCounts[1] ?? 0,
                $ratingCounts[2] ?? 0,
                $ratingCounts[3] ?? 0,
                $ratingCounts[4] ?? 0,
                $ratingCounts[5] ?? 0,
            ]
        ];
        // --- AKHIR TAMBAHAN BARU ---


        // 4. Kirim semua data ke halaman React
        return inertia('Admin/Dashboard', [
            'stats' => [
                'totalBooks' => $totalBooks,
                'totalCategories' => $totalCategories,
                'totalUsers' => $totalUsers,
                'totalDownloads' => $totalDownloads,
                'totalViews' => $totalViews,
                'avgRating' => round($avgRating, 1),
            ],
            'popularBooks' => $popularBooks,
            'ratingChartData' => $ratingChartData, // <-- KIRIM DATA BARU INI
        ]);
    }
}