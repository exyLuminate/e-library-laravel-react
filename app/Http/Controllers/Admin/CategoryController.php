<?php

// app/Http/Controllers/Admin/CategoryController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia; // Untuk render komponen React

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource. (INDEX)
     */
    public function index()
    {
        // Ambil semua kategori, diurutkan berdasarkan nama
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage. (CREATE)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori baru berhasil ditambahkan!');
    }

    /**
     * Update the specified resource in storage. (UPDATE)
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $category->id,
        ]);

        $category->update([
            'name' => $request->name,
        ]);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage. (DELETE)
     */
    public function destroy(Category $category)
    {
        // Pastikan tidak ada buku yang terikat (Walaupun onDelete:SET NULL, lebih baik cek)
        if ($category->books()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Tidak dapat menghapus. Kategori ini masih digunakan oleh ' . $category->books()->count() . ' buku.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategori berhasil dihapus!');
    }
}
