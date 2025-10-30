<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\RatingAndReview;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class RatingAndReviewController extends Controller
{
    /**
     * Menyimpan atau memperbarui ulasan dan rating dari pengguna.
     */
    public function store(Request $request, Book $book)
    {
        // 1. Validasi Data
        $validated = $request->validate([
            'rating' => [
                'required', 
                'integer', 
                'min:1', 
                'max:5'
            ],
            'review' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();
        

        // 2. Simpan atau Perbarui Ulasan (Menggunakan updateOrCreate)
        $review = RatingAndReview::updateOrCreate(
            [
                'user_id' => $user->id,
                'book_id' => $book->id,
            ],
            [
                'rating' => $validated['rating'],
                'review' => $validated['review'] ?? null, // Simpan null jika kosong
            ]
        );

        $message = $review->wasRecentlyCreated 
                    ? 'Terima kasih, ulasan Anda berhasil dikirim!' 
                    : 'Ulasan Anda berhasil diperbarui!';

        // 3. Redirect kembali ke halaman buku dengan flash message
        return back()->with('success', $message);
    }
}