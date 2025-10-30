<?php

namespace App\Http\Controllers; // <-- FIXED NAMESPACE

use App\Models\Book;
use App\Models\ReadHistory;
use App\Models\Favorite;
use Inertia\Inertia; // <-- Import Inertia
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // <-- Import Storage
use Illuminate\Support\Str; // <-- Import Str

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     * NOTE: Currently handled by PublicController. Leave empty or add basic logic if needed later.
     */
    public function index()
    {
        // Logic for displaying the book list (if not handled by PublicController)
    }

    /**
     * Display the specified resource. (Book Detail Page)
     * Handles incrementing views_count.
     * Uses with() to eager load relations reliably.
     *
     * @param  \App\Models\Book  $book (Received via route model binding)
     * @return \Inertia\Response
     */
    public function show(Book $book) // $book here might not have relations loaded yet
    {
        // 1. Increment Views Count (on the initial instance)
        $book->increment('views_count');

        // 2. Logika Tracking Riwayat Baca
        if (auth()->check()) {
            $user = auth()->user();
            ReadHistory::updateOrCreate(
                ['user_id' => $user->id, 'book_id' => $book->id],
                ['last_read_at' => now()]
            );
        }

        // 3. Eager load relations using with() before sending to Inertia
        $bookWithRelations = Book::with(['category', 'reviews.user']) // Eager load category, reviews, AND the user for each review
                             ->find($book->id); // Find the book again by its ID

        // Handle case where book might not be found
        if (!$bookWithRelations) {
            abort(404);
        }

        // 4. Cek Status Favorit using the newly fetched book data
        $isFavorite = false;
        if (auth()->check()) {
            $isFavorite = Favorite::where('user_id', auth()->id())
                                  ->where('book_id', $bookWithRelations->id) // Use ID from $bookWithRelations
                                  ->exists();
        }

        // 5. Kirim data ke komponen React 'Book/Show.jsx'
        return Inertia::render('Book/Show', [
            'book' => $bookWithRelations, // Send the book data WITH loaded relations
            'isFavorite' => $isFavorite,    // Send favorite status
        ]);
    }

    /**
     * Handle request to view or download the book's PDF file.
     * Handles incrementing download_count.
     *
     * @param  \App\Models\Book  $book
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadOrRead(Book $book)
    {
        // Middleware 'auth' in web.php ensures the user is logged in

        $path = $book->file_path; // Get PDF file path from Book model

        // Validate: Check if path exists and file actually exists in storage
        if (!$path || !Storage::disk('public')->exists($path)) {
            abort(404, 'File buku tidak ditemukan.'); // Show 404 error if file is missing
        }

        // Increment Download Count
        $book->increment('download_count');

        // Create a user-friendly filename (e.g., book-title.pdf)
        $filename = Str::slug($book->title) . '.pdf';

        // Send the file response to the browser
        return Storage::disk('public')->response($path, $filename, [
            'Content-Type' => 'application/pdf',
            // 'inline' attempts to open the file in the browser's PDF viewer
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}