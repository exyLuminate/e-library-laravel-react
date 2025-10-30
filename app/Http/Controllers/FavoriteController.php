<?php

// app/Http/Controllers/FavoriteController.php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function toggle(Book $book)
    {
        $user = auth()->user();
        // Cek apakah buku sudah ada di favorit
        $favorite = Favorite::where('user_id', $user->id)
                            ->where('book_id', $book->id)
                            ->first();

        if ($favorite) {
            // Jika sudah ada, HAPUS (Unfavorite)
            $favorite->delete();
            $message = "Buku dihapus dari favorit.";
        } else {
            // Jika belum ada, BUAT (Favorite)
            Favorite::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
            ]);
            $message = "Buku ditambahkan ke favorit!";
        }

        // Kembali ke halaman sebelumnya dengan pesan
        return back()->with('success', $message);
    }
}