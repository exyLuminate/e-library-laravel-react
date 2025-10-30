<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Book; // <-- TAMBAHKAN INI
use App\Models\User; // <-- TAMBAHKAN INI

class RatingAndReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'rating',
        'review',
    ];

    /**
     * Relasi ke Model Book (Wajib untuk DashboardController)
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
    
    /**
     * Relasi ke Model User (Opsional, tapi baik untuk konsistensi)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}