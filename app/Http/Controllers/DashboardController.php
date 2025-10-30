<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RatingAndReview; // Import
use App\Models\Favorite;         // Import
use App\Models\ReadHistory;      // Import

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();


        
        // Muat Ulasan yang pernah diberikan user, batasi 5, dan muat data bukunya
        // Catatan: Anda harus menambahkan relasi 'book' di Model RatingAndReview
        $reviews = RatingAndReview::where('user_id', $user->id)
                        ->with('book:id,title,author') 
                        ->latest()
                        ->take(5)
                        ->get();

        // Muat Daftar Favorit user, batasi 5, dan muat data bukunya
        // Catatan: Anda harus menambahkan relasi 'book' di Model Favorite
        $favorites = Favorite::where('user_id', $user->id)
                          ->with('book:id,title,author') 
                          ->latest()
                          ->take(5)
                          ->get();
        
        // Muat Riwayat Baca user, batasi 5, diurutkan dari yang terakhir dibaca
        // Catatan: Anda harus menambahkan relasi 'book' di Model ReadHistory
        $readHistory = ReadHistory::where('user_id', $user->id)
                            ->with('book:id,title,author') 
                            ->orderByDesc('last_read_at')
                            ->take(5)
                            ->get();

        return Inertia::render('Dashboard', [
            'reviews' => $reviews,
            'favorites' => $favorites,
            'readHistory' => $readHistory,
        ]);
    }
}