<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Book;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
    ];

    /**
     * Relasi ke Model Book (Wajib untuk DashboardController)
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    // ... (Anda bisa menambahkan relasi user() di sini juga)
}