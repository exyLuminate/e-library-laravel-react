// resources/js/Pages/Admin/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// ===================================
// IMPORT BARU UNTUK CHART
// ===================================
import { Doughnut } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend 
} from 'chart.js';

// Daftarkan komponen chart
ChartJS.register(ArcElement, Tooltip, Legend);
// ===================================

// Komponen Kartu Statistik (dari langkah sebelumnya)
function StatCard({ label, value }) {
    return (
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500 truncate">{label}</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    );
}

// Terima props baru: 'ratingChartData'
export default function Dashboard({ auth, stats, popularBooks, ratingChartData }) {
    
    // Siapkan data untuk komponen Doughnut Chart
    const chartConfig = {
        data: {
            labels: ratingChartData.labels,
            datasets: [
                {
                    label: 'Jumlah Ulasan',
                    data: ratingChartData.data,
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)',  // Bintang 1 (red-600)
                        'rgba(249, 115, 22, 0.7)', // Bintang 2 (orange-500)
                        'rgba(245, 158, 11, 0.7)', // Bintang 3 (amber-500)
                        'rgba(163, 230, 53, 0.7)', // Bintang 4 (lime-400)
                        'rgba(34, 197, 94, 0.7)',   // Bintang 5 (green-500)
                    ],
                    borderColor: [
                        'rgba(239, 68, 68, 1)',
                        'rgba(249, 115, 22, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(163, 230, 53, 1)',
                        'rgba(34, 197, 94, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribusi Rating Buku',
                    font: {
                        size: 16
                    }
                },
            },
        },
    };

    return (
        <>
            <Head title="Laporan (Admin)" />

            <div className="text-lg font-semibold mb-4">
                Selamat Datang, {auth.user.name}!
            </div>
            
            {/* BAGIAN 1: KARTU STATISTIK (dari langkah sebelumnya) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                <StatCard label="Total Buku" value={stats.totalBooks} />
                <StatCard label="Total Pengguna" value={stats.totalUsers} />
                <StatCard label="Total Kategori" value={stats.totalCategories} />
                <StatCard label="Total Views" value={stats.totalViews} />
                <StatCard label="Total Downloads" value={stats.totalDownloads} />
                <StatCard label="Rata-rata Rating" value={`${stats.avgRating} / 5.0`} />
            </div>

            {/* =================================== */}
            {/* BAGIAN 2: CHART & DAFTAR (BARU)     */}
            {/* =================================== */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* SISI KIRI: CHART */}
                <div className="bg-white shadow-sm sm:rounded-lg p-6 flex justify-center items-center">
                    {/* Atur lebar chart agar tidak terlalu besar di container-nya */}
                    <div className="w-full max-w-sm">
                        <Doughnut data={chartConfig.data} options={chartConfig.options} />
                    </div>
                </div>

                {/* SISI KANAN: LIST BUKU POPULER (dari langkah sebelumnya) */}
                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Buku Paling Banyak Dilihat
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        {popularBooks.map((book) => (
                            <li key={book.id} className="py-3 flex justify-between items-center">
                                <Link 
                                    href={route('books.show', book.id)} 
                                    className="text-indigo-600 hover:text-indigo-800"
                                >
                                    {book.title}
                                </Link>
                                <span className="text-gray-600">{book.views_count} views</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <AuthenticatedLayout children={page} />;