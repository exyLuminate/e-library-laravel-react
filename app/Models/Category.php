<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // ID auto increment (default Laravel)
    protected $fillable = ['name'];

    // Relasi: Satu kategori memiliki banyak buku
    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
