// resources/js/Pages/Book/Show.jsx

import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout'; // Menggunakan PublicLayout
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
// DangerButton tidak digunakan di sini, bisa dihapus jika mau
// import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput'; // Pastikan TextInput diimpor jika diperlukan di masa depan
import InputError from '@/Components/InputError';
import Textarea from '@/Components/Textarea'; // Pastikan komponen Textarea ada

const COVER_BASE_URL = '/storage/';

// --- Komponen Bintang Sederhana ---
const StarRating = ({ rating, size = 'text-xl' }) => {
    const stars = Array(5).fill(0).map((_, i) => (
        <span
            key={i}
            className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
            ★
        </span>
    ));
    return <div className="flex items-center space-x-0.5">{stars}</div>;
};
// ---------------------------------

// Terima auth, book, isFavorite dari controller BookController@show
export default function Show({ auth, book, isFavorite }) {
    // Ambil flash message dari session (jika ada)
    const { success } = usePage().props.flash || {}; // Tambahkan default {}

    // --- 1. Logika Toggle Favorit ---
    const { post: postFavorite, processing: processingFavorite } = useForm({});

    const handleToggleFavorite = () => {
        postFavorite(route('books.favorite.toggle', book.id), {
            preserveScroll: true,
        });
    };

    // --- 2. Logika Form Ulasan ---
    // Cek apakah user saat ini sudah punya ulasan untuk buku ini
    const existingReview = book.reviews.find(review => auth.user && review.user_id === auth.user.id);

    const { data: reviewData, setData: setReviewData, post: postReview, processing: processingReview, errors: reviewErrors, reset: resetReview, clearErrors } = useForm({
        // Inisialisasi rating & review dengan nilai ulasan yang sudah ada (jika ada)
        rating: existingReview?.rating || 0,
        review: existingReview?.review || '',
    });

    const handleRatingChange = (newRating) => {
        setReviewData('rating', newRating);
    };

    const submitReview = (e) => {
        e.preventDefault();
        // POST ke route 'reviews.store'. Controller akan handle update jika sudah ada.
        postReview(route('reviews.store', book.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Jangan reset rating jika hanya update comment
                // resetReview('review');
                // Mungkin lebih baik tidak reset agar user bisa edit lagi
            },
            onError: () => {
                // Error akan otomatis ditampilkan oleh InputError
            }
        });
    };

    // Tentukan URL untuk melihat PDF
    const fileUrl = book.file_path ? route('books.file', book.id) : '#'; // Handle jika file_path null

    console.log("Data buku diterima di Show.jsx:", book);
    console.log("Data ulasan diterima:", book.reviews);

    return (
        // Gunakan PublicLayout, kirim user agar layout tahu status login
        <PublicLayout>
            <Head title={book.title} />

            {/* Konten utama dengan padding dan pembatas lebar */}
            <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                {/* Notifikasi Flash */}
                {success && (
                    <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                        {success}
                    </div>
                )}

                {/* Kontainer Detail Buku */}
                <div className="bg-white p-6 sm:p-8 shadow-xl rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                        {/* Kolom Kiri: Cover & Tombol PDF */}
                        <div className="md:col-span-1">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-md mb-4"> {/* Ganti h-96 ke aspect ratio */}
                                {book.cover_path ? (
                                    <img
                                        src={COVER_BASE_URL + book.cover_path}
                                        alt={`Cover ${book.title}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Cover</div>
                                )}
                            </div>

                            {/* Tombol Aksi PDF (hanya jika file ada) */}
                            {book.file_path ? (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block"> {/* Jadikan block agar full width */}
                                    <PrimaryButton className="w-full justify-center mt-2"> {/* Tambah mt-2 */}
                                        Baca/Unduh PDF 📖
                                    </PrimaryButton>
                                </a>
                            ) : (
                                <p className="text-sm text-center text-gray-500 mt-2">File PDF tidak tersedia.</p>
                            )}
                        </div>

                        {/* Kolom Kanan: Detail Buku & Aksi */}
                        <div className="md:col-span-2">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-1">{book.title}</h1>
                            <p className="text-lg lg:text-xl text-indigo-600 mb-4">Oleh: {book.author}</p>

                            {/* Tombol Favorit */}
                            {auth.user && (
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={processingFavorite}
                                    className={`mb-6 px-4 py-2 rounded-lg text-white font-semibold text-sm transition duration-200 flex items-center ${
                                        isFavorite
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-gray-400 hover:bg-gray-500' // Ubah warna default
                                    }`}
                                >
                                    {isFavorite ? '❤️ Hapus dari Favorit' : '🤍 Tambah ke Favorit'}
                                    {processingFavorite && <span className="ml-2">...</span>}
                                </button>
                            )}

                            {/* Info & Deskripsi */}
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-600 border-b pb-4">
                                <span><strong className="font-semibold text-gray-800">Kategori:</strong> {book.category ? book.category.name : '-'}</span>
                                <span><strong className="font-semibold text-gray-800">Tahun:</strong> {book.year || '-'}</span>
                                <span><strong className="font-semibold text-gray-800">ISBN:</strong> {book.isbn || '-'}</span>
                                <span><strong className="font-semibold text-gray-800">Penerbit:</strong> {book.publisher || '-'}</span>
                                <span><strong className="font-semibold text-gray-800">Bahasa:</strong> {book.language || '-'}</span>
                            </div>

                            <div className="mb-6">
                                <p className="text-base font-semibold text-gray-800 mb-2">Deskripsi:</p>
                                <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{book.description || 'Tidak ada deskripsi tersedia.'}</p>
                            </div>

                            {/* Statistik */}
                            <div className="flex space-x-4 text-sm text-gray-500">
                                <span><strong className="font-semibold text-gray-700">Dilihat:</strong> {book.views_count || 0} kali</span>
                                <span><strong className="font-semibold text-gray-700">Diunduh:</strong> {book.download_count || 0} kali</span>
                            </div>

                        </div>
                    </div>

                    {/* SEKSI ULASAN & RATING */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ulasan Pembaca ({book.reviews.length})</h2>

                        {/* Form Ulasan Baru */}
                        {auth.user && (
                            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">
                                    {existingReview ? 'Perbarui Ulasan Anda' : 'Tulis Ulasan Anda'}
                                </h3>

                                <form onSubmit={submitReview}>
                                    {/* Input Rating Bintang */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Beri Rating:</label>
                                        <div className="flex cursor-pointer space-x-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={`text-3xl transition-colors ${
                                                        star <= reviewData.rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                                                    }`}
                                                    onClick={() => handleRatingChange(star)}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <InputError message={reviewErrors.rating} className="mt-1" />
                                    </div>

                                    {/* Input Review */}
                                    <div className="mb-4">
                                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Komentar (Opsional):</label>
                                        <Textarea
                                            id="review" name="review" rows="3"
                                            value={reviewData.review}
                                            onChange={(e) => setReviewData('review', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Tulis pendapat Anda tentang buku ini..."
                                        />
                                        <InputError message={reviewErrors.review} className="mt-1" />
                                    </div>

                                    <PrimaryButton type="submit" disabled={processingReview || reviewData.rating === 0}>
                                        {processingReview ? 'Memproses...' : (existingReview ? 'Perbarui Ulasan' : 'Kirim Ulasan')}
                                    </PrimaryButton>
                                    {/* Tombol hapus ulasan jika sudah ada */}
                                    {/* {existingReview && !processingReview && (
                                        <button type="button" onClick={handleDeleteReview} className="ml-4 text-sm text-red-600 hover:text-red-800">
                                            Hapus Ulasan Saya
                                        </button>
                                    )} */}
                                </form>
                            </div>
                        )}

                        {/* Daftar Ulasan */}
                        <div className="space-y-6">
                            {book.reviews.length > 0 ? (
                                book.reviews.map((review) => (
                                    <div key={review.id} className="p-4 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-semibold text-gray-800">
                                                {/* INI PERBAIKANNYA */}
                                                {review.user ? review.user.name : '[Pengguna Dihapus]'}
                                                {review.user_id === auth.user?.id && <span className="ml-2 text-xs text-indigo-500 font-normal">(Anda)</span>}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(review.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} size="text-lg" />
                                        <p className="mt-2 text-gray-700 text-sm whitespace-pre-line">{review.review || <span className="italic text-gray-500">Tidak ada komentar.</span>}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-sm">Belum ada ulasan untuk buku ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

// Tidak perlu Show.layout karena PublicLayout sudah membungkus di return