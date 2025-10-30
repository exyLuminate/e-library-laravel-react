<?php
// app/Models/User.php

namespace App\Models;

// Tambahkan use statement ini
use Illuminate\Database\Eloquent\Concerns\HasUuids; 
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\RatingAndReview; // Tambahkan
use App\Models\Favorite; // Tambahkan
use App\Models\ReadHistory; // Tambahkan

// Implement MustVerifyEmail agar verifikasi email berjalan
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids; // <-- Tambahkan HasUuids di sini
    public function reviews() 
    {
        return $this->hasMany(RatingAndReview::class);
    }
    public function favorites() 
    {
        return $this->hasMany(Favorite::class);
    }
    public function readHistories() 
    {
        return $this->hasMany(ReadHistory::class)->orderByDesc('last_read_at');
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}