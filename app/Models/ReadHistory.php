<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Book; // <-- TAMBAHKAN INI

class ReadHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'last_read_at',
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