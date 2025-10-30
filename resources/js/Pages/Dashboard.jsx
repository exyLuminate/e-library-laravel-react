// resources/js/Pages/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Tambahkan komponen bintang sederhana (atau gunakan Tailwind/Heroicons)
const StarRating = ({ rating }) => {
    const stars = Array(5).fill(0).map((_, i) => (
        <span 
            key={i} 
            className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
            ★
        </span>
    ));
    return <div className="flex items-center space-x-0.5">{stars}</div>;
};


export default function Dashboard({ auth, reviews, favorites, readHistory }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Anda</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Halo, {auth.user.name}! Selamat datang di area personal Anda.
                        </div>
                    </div>

                    {/* KONTEN DASHBOARD PERSONAL */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* 1. Ulasan & Rating Anda */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                <span role="img" aria-label="Review">⭐</span> Ulasan & Rating Terbaru
                            </h3>
                            {reviews.length > 0 ? (
                                <ul className="space-y-4">
                                    {reviews.map((item) => (
                                        <li key={item.id} className="border-l-4 border-yellow-500 pl-3">
                                            <Link href={route('books.show', item.book.id)} className="font-medium text-indigo-600 hover:text-indigo-800">
                                                {item.book.title}
                                            </Link>
                                            <StarRating rating={item.rating} />
                                            <p className="text-sm text-gray-600 italic">"{item.review || 'Tidak ada komentar.'}"</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Anda belum memberikan ulasan.</p>
                            )}
                        </div>

                        {/* 2. Riwayat Baca */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                <span role="img" aria-label="History">📚</span> Riwayat Akses Terakhir
                            </h3>
                            {readHistory.length > 0 ? (
                                <ul className="space-y-2">
                                    {readHistory.map((item) => (
                                        <li key={item.id} className="text-sm">
                                            <Link href={route('books.show', item.book.id)} className="font-medium text-gray-700 hover:text-indigo-600 truncate block">
                                                {item.book.title}
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                                Terakhir diakses: {new Date(item.last_read_at).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Anda belum pernah mengakses buku apa pun.</p>
                            )}
                        </div>
                        
                        {/* 3. Daftar Favorit */}
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                                <span role="img" aria-label="Favorite">💖</span> Buku Favorit Anda
                            </h3>
                            {favorites.length > 0 ? (
                                <ul className="space-y-2">
                                    {favorites.map((item) => (
                                        <li key={item.id} className="text-sm">
                                            <Link href={route('books.show', item.book.id)} className="font-medium text-green-600 hover:text-green-800 truncate block">
                                                {item.book.title}
                                            </Link>
                                            <span className="text-xs text-gray-500">Oleh: {item.book.author}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">Anda belum menambahkan buku ke favorit.</p>
                            )}
                        </div>

                    </div>
                    {/* AKHIR KONTEN DASHBOARD PERSONAL */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}