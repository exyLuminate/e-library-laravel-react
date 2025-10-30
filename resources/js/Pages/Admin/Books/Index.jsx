// resources/js/Pages/Admin/Books/Index.jsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';

// URL Base untuk cover
const COVER_BASE_URL = '/storage/';

export default function Index({ auth, books, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleDelete = (id) => {
        if (confirm('Anda yakin ingin menghapus buku ini? Semua file terkait (cover & PDF) juga akan dihapus.')) {
            router.delete(route('admin.books.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.books.index'),
            { search: search },
            { preserveState: true, replace: true }
        );
    };

    return (
        <>
            <Head title="Kelola Buku" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                {/* --- BAGIAN SEARCH & TOMBOL TAMBAH SEJAJAR --- */}
                <div className="mb-6 flex justify-between items-center gap-4">

                    {/* Search Form (Kiri) */}
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center flex-grow">
                        <TextInput
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul atau penulis..."
                            className="flex-grow min-w-0" // Input mengisi sisa ruang form
                        />
                        <PrimaryButton type="submit">
                            Cari
                        </PrimaryButton>
                    </form>

                    {/* Tombol Tambah (Kanan) */}
                    <Link href={route('admin.books.create')}>
                        <PrimaryButton className="whitespace-nowrap"> {/* Mencegah teks pecah */}
                            + Tambah Buku Baru
                        </PrimaryButton>
                    </Link>

                </div>
                {/* --- AKHIR BAGIAN SEARCH & TOMBOL TAMBAH --- */}


                {/* Tabel Daftar Buku */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul & Penulis</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statistik</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.data.map((book) => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {book.cover_path ? (
                                            <img
                                                src={COVER_BASE_URL + book.cover_path}
                                                alt={`Cover ${book.title}`}
                                                className="w-12 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Cover</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                        <div className="text-sm text-gray-500">Oleh: {book.author}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {book.category ? book.category.name : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        View: {book.views_count} | Download: {book.download_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link href={route('admin.books.edit', book.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                                            Edit
                                        </Link>
                                        <DangerButton
                                            onClick={() => handleDelete(book.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Hapus
                                        </DangerButton>
                                    </td>
                                </tr>
                            ))}
                            {books.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        {filters.search ? `Tidak ada buku yang cocok dengan pencarian "${filters.search}".` : 'Belum ada buku yang ditambahkan.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    {books.links.map((link, index) => (
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-1 border rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ) : (
                            <span
                                key={index}
                                className="mx-1 px-3 py-1 border rounded bg-gray-100 text-gray-400"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    ))}
                </div>

            </div>
        </>
    );
}

// Layout permanen
Index.layout = page => (
    <AuthenticatedLayout
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Buku</h2>}
    >
        {page}
    </AuthenticatedLayout>
);