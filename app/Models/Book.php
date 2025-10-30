<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids; // Karena menggunakan UUID
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\RatingAndReview;
use Illuminate\Database\Eloquent\SoftDeletes; // Karena ada deleted_at

class Book extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    // Tentukan kolom mana yang boleh diisi
    protected $fillable = [
        'title', 'language', 'author', 'publisher', 'year', 'isbn', 
        'category_id', 'description', 'cover_path', 'file_path', 'views_count', 'download_count'
    ];

    // Kolom yang harus di-cast
    protected $casts = [
        'year' => 'integer',
    ];

    public function reviews()
    {
        return $this->hasMany(RatingAndReview::class);
    }
    
    // Relasi: Satu buku dimiliki oleh satu kategori
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relasi: Satu buku memiliki banyak rating
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    // Relasi: Satu buku memiliki banyak aktivitas baca
    public function reads()
    {
        return $this->hasMany(Read::class);
    }
}