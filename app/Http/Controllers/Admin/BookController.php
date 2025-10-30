<?php

// app/Http/Controllers/Admin/BookController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
// use App\Models\ReadHistory; // Tidak digunakan di controller ini
// use App\Models\Read; // Tidak digunakan di controller ini
use App\Models\Category;
use Illuminate\Http\Request; // Diperlukan untuk method index, store, update
use Inertia\Inertia; // Diperlukan untuk method index, create, edit
use Illuminate\Support\Facades\Storage; // Diperlukan untuk store, update, destroy
use Illuminate\Validation\Rule; // Diperlukan untuk validationRules
use Illuminate\Support\Str; // Diperlukan untuk store, update

class BookController extends Controller
{
    /**
     * Display a listing of the resource. (INDEX - Halaman Kelola Buku)
     * Handles search functionality.
     */
    public function index(Request $request)
    {
        // Ambil string pencarian dari URL (?search=...)
        $searchFilter = $request->query('search');

        $books = Book::with('category') // Eager load relasi
            
            // Terapkan filter HANYA JIKA $searchFilter ada isinya
            ->when($searchFilter, function ($query, $search) {
                // Cari di kolom 'title' ATAU 'author'
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('author', 'like', "%{$search}%");
            })
            
            ->orderBy('created_at', 'desc') // Tampilkan yang terbaru
            ->paginate(10) // Paginasi
            
            // PENTING: Agar link pagination tetap membawa ?search=...
            ->withQueryString();

        // Kirim data buku DAN filter kembali ke React
        return Inertia::render('Admin/Books/Index', [
            'books' => $books,
            'filters' => ['search' => $searchFilter] // Kirim filter ke React
        ]);
    }

    /**
     * Show the form for creating a new resource. (Halaman Tambah Buku)
     */
    public function create()
    {
        $categories = Category::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Books/CreateEdit', [
            'categories' => $categories,
            'book' => null // Kirim null agar form tahu ini mode create
        ]);
    }

    /**
     * Store a newly created resource in storage. (Proses Simpan Buku Baru)
     */
    public function store(Request $request)
    {
        // Validasi input (menggunakan helper validationRules)
        $validated = $request->validate($this->validationRules());

        $book = new Book($validated);

        // --- Logika Upload Cover ---
        if ($request->hasFile('cover_file')) {
            $coverName = time() . '_' . Str::slug($validated['title']) . '.' . $request->file('cover_file')->extension();
            // Simpan ke storage/app/public/covers
            $path = $request->file('cover_file')->storeAs('covers', $coverName, 'public');
            $book->cover_path = $path; // Simpan path relatif
        }

        // --- Logika Upload File PDF ---
        if ($request->hasFile('pdf_file')) {
            $pdfName = time() . '_' . Str::slug($validated['title']) . '.pdf';
             // Simpan ke storage/app/public/pdfs
            $path = $request->file('pdf_file')->storeAs('pdfs', $pdfName, 'public');
            $book->file_path = $path; // Simpan path relatif
        }

        $book->save(); // Simpan data buku ke database

        // Redirect kembali ke halaman index admin dengan pesan sukses
        return redirect()->route('admin.books.index')->with('success', 'Buku baru berhasil ditambahkan!');
    }

     /**
     * Display the specified resource. (Method Show untuk Admin - Opsional)
     * Biasanya tidak diperlukan jika detail dilihat di halaman publik.
     * Jika diperlukan, bisa ditambahkan di sini.
     */
    public function show(Book $book)
    {
         // Contoh: Mungkin admin perlu melihat detail berbeda?
         // $book->load('logs'); // Misalnya memuat log aktivitas admin terkait buku ini
         // return Inertia::render('Admin/Books/ShowDetail', ['book' => $book]);
         // Untuk saat ini, kita redirect ke halaman publik saja
         return redirect()->route('books.show', $book->id);
    }

    /**
     * Show the form for editing the specified resource. (Halaman Edit Buku)
     */
    public function edit(Book $book)
    {
        $categories = Category::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Books/CreateEdit', [
            'book' => $book, // Kirim data buku yang akan diedit
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage. (Proses Simpan Perubahan Buku)
     */
    public function update(Request $request, Book $book)
    {
        // Validasi input (file tidak wajib saat update, ISBN unik kecuali untuk buku ini sendiri)
        $validated = $request->validate($this->validationRules(false, $book));

        $book->fill($validated); // Isi model dengan data tervalidasi

        // --- Logika Update Cover ---
        if ($request->hasFile('cover_file')) {
            // Hapus cover lama jika ada sebelum menyimpan yang baru
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            $coverName = time() . '_' . Str::slug($validated['title']) . '.' . $request->file('cover_file')->extension();
            $path = $request->file('cover_file')->storeAs('covers', $coverName, 'public');
            $book->cover_path = $path;
        }

        // --- Logika Update File PDF ---
        if ($request->hasFile('pdf_file')) {
            // Hapus file PDF lama jika ada sebelum menyimpan yang baru
            if ($book->file_path) {
                Storage::disk('public')->delete($book->file_path);
            }
            $pdfName = time() . '_' . Str::slug($validated['title']) . '.pdf';
            $path = $request->file('pdf_file')->storeAs('pdfs', $pdfName, 'public');
            $book->file_path = $path;
        }

        $book->save(); // Simpan perubahan

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage. (Proses Hapus Buku)
     */
    public function destroy(Book $book)
    {
        // Hapus file fisik (cover & pdf) dari storage sebelum menghapus record DB
        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }
        if ($book->file_path) {
            Storage::disk('public')->delete($book->file_path);
        }

        $book->delete(); // Hapus record buku (Soft Delete karena model Book pakai trait SoftDeletes)

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus!');
    }

    /**
     * Helper function for validation rules.
     *
     * @param bool $isCreating Determines if rules are for creation (files required) or update (files optional)
     * @param Book|null $book The book instance being updated (for unique ISBN check)
     * @return array
     */
    protected function validationRules($isCreating = true, $book = null)
    {
        return [
            'title' => 'required|string|max:200',
            'author' => 'required|string|max:150',
            'category_id' => 'nullable|exists:categories,id', // Pastikan category_id ada di tabel categories
            'description' => 'nullable|string',
            'language' => 'nullable|string|max:50',
            'publisher' => 'nullable|string|max:150',
            'year' => 'nullable|integer|digits:4|gte:1000|lte:'.date('Y'), // Tahun antara 1000 s/d tahun ini
            'isbn' => ['nullable', 'string', 'max:50', Rule::unique('books', 'isbn')->ignore($book?->id)], // ISBN unik, abaikan ID buku saat ini jika update
            // Aturan File: image (jpg, jpeg, png, gif, dll), max 2MB; pdf, max 10MB
            'cover_file' => [$isCreating ? 'required' : 'nullable', 'image', 'max:2048'],
            'pdf_file' => [$isCreating ? 'required' : 'nullable', 'mimes:pdf', 'max:10240'],
        ];
    }

    // METHOD downloadOrRead SUDAH DIHAPUS DARI CONTROLLER INI
}