<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Category; // Import Category
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage; // Import Storage
use Illuminate\Support\Str; // Import Str

class BookFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Book::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ambil ID kategori secara acak (pastikan tabel categories sudah ada isinya)
        // Atau buat kategori dummy juga jika perlu
        $categoryIds = Category::pluck('id')->toArray();
        $randomCategoryId = !empty($categoryIds) ? $this->faker->randomElement($categoryIds) : null;

        // --- Logika Cover Acak dari Sample ---
        $sampleCoverDir = 'public/covers/samples';
        $sampleCovers = Storage::files($sampleCoverDir);
        $randomCoverPath = null;
        if (!empty($sampleCovers)) {
            // Ambil path relatif dari storage/app/public/
            $randomCoverPath = Str::replaceFirst('public/', '', $this->faker->randomElement($sampleCovers));
        }

        // --- Logika Copy Dummy PDF ---
        $dummyPdfOriginalPath = 'public/pdfs/dummy_book.pdf';
        $newPdfName = Str::uuid() . '.pdf'; // Nama unik untuk file PDF dummy
        $newPdfPath = 'pdfs/' . $newPdfName;
        // Pastikan dummy PDF ada sebelum dicopy
        if (Storage::exists($dummyPdfOriginalPath)) {
            Storage::copy($dummyPdfOriginalPath, 'public/' . $newPdfPath);
        } else {
            // Jika dummy PDF tidak ada, set path ke null atau path default
            $newPdfPath = null; 
            // Atau $newPdfPath = 'pdfs/dummy_book.pdf'; jika ingin semua pakai 1 file
        }

        return [
            // Data Realistis dari Faker
            'title' => Str::title($this->faker->words($this->faker->numberBetween(3, 7), true)), // Judul 3-7 kata
            'author' => $this->faker->name(),
            'description' => $this->faker->paragraph(3), // Deskripsi 3 paragraf
            'language' => $this->faker->randomElement(['Indonesia', 'English']),
            'publisher' => $this->faker->company(),
            'year' => $this->faker->numberBetween(1990, date('Y')), // Tahun antara 1990 - sekarang
            'isbn' => $this->faker->optional()->isbn13(), // ISBN (bisa null)
            'views_count' => $this->faker->numberBetween(0, 500),
            'download_count' => $this->faker->numberBetween(0, 100),

            // Relasi & File
            'category_id' => $randomCategoryId,
            'cover_path' => $randomCoverPath, // Path ke salah satu cover sample acak
            'file_path' => $newPdfPath, // Path ke file PDF dummy yang baru dicopy
        ];
    }
}