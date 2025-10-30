<?php
// app/Http/Controllers/PublicController.php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * Menampilkan daftar buku di halaman utama.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');

        $books = Book::with('category')
            ->when($search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%")
                             ->orWhere('author', 'like', "%{$search}%")
                             ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($category, function ($query, $category) {
                return $query->whereHas('category', function ($q) use ($category) {
                    $q->where('name', $category);
                });
            })
            ->whereNull('deleted_at') // Pastikan hanya buku yang tidak di soft delete
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString(); // Mempertahankan parameter query saat pagination

        $categories = Category::select('name')->distinct()->get();

        return Inertia::render('Welcome', [ // Menggunakan Welcome.jsx
            'books' => $books,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ]
        ]);
    }
    
    /**
     * Menampilkan detail buku tertentu.
     */
    public function show(Book $book)
    {
        // Increment views count saat user melihat halaman detail
        $book->increment('views_count');
        
        return Inertia::render('Book/Show', [
            'book' => $book->load('category'),
            // Tambahkan data terkait lainnya jika perlu (misal: rekomendasi)
        ]);
    }
}