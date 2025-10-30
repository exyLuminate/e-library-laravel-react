// resources/js/Pages/Welcome.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

const COVER_BASE_URL = '/storage/';

export default function Welcome({ books, categories, filters }) {

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        category: filters.category || '',
    });

    const handleFilter = (e) => { e.preventDefault(); get(route('home'), { preserveState: true, replace: true }); };
    const handleClearFilter = () => { setData({ search: '', category: '' }); get(route('home'), { data: { search: '', category: '' }, replace: true }); }

    return (
        <>
            <Head title="E-Library" />

            {/* Konten Halaman */}
            <div>

                {/* Filter and Search */}
                <div className="mb-8 p-6 bg-white shadow sm:rounded-lg">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Cari Judul, Penulis, atau Deskripsi</label>
                            <TextInput id="search" type="text" className="mt-1 block w-full" value={data.search} onChange={(e) => setData('search', e.target.value)} placeholder="Cari buku..." />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Filter Kategori</label>
                            <select id="category" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" value={data.category} onChange={(e) => setData('category', e.target.value)}>
                                <option value="">-- Semua Kategori --</option>
                                {categories.map((cat, index) => (<option key={index} value={cat.name}>{cat.name}</option>))}
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <PrimaryButton type="submit" disabled={processing}>Terapkan Filter</PrimaryButton>
                            <button type="button" onClick={handleClearFilter} className="text-sm text-gray-500 hover:text-gray-700">Reset</button>
                        </div>
                    </form>
                </div>

                {/* Daftar Buku (Grid) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {books.data.map((book) => (
                        <Link key={book.id} href={route('books.show', book.id)} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                            {/* Cover */}
                            {/* 👇 UBAH TINGGI GAMBAR DI SINI 👇 */}
                            <div className="h-48 w-full overflow-hidden mb-3"> {/* Sebelumnya h-60 */}
                            {/* 👆 --- 👆 */}
                                {book.cover_path ? (
                                    <img src={COVER_BASE_URL + book.cover_path} alt={`Cover ${book.title}`} className="w-full h-full object-cover rounded"/>
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Cover</div>
                                )}
                            </div>
                            {/* Detail */}
                            <h3 className="text-md font-semibold text-gray-900 truncate">{book.title}</h3>
                            <p className="text-sm text-indigo-600">{book.category ? book.category.name : 'Uncategorized'}</p>
                            <p className="text-xs text-gray-500 mt-1">Oleh: {book.author}</p>
                        </Link>
                    ))}
                </div>

                {books.data.length === 0 && (<div className="text-center py-10 text-gray-500">Tidak ada buku yang sesuai dengan kriteria pencarian Anda.</div>)}

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    {books.links && books.links.map((link, index) => (
                        link.url ? (
                            <Link key={index} href={link.url} className={`mx-1 px-3 py-1 border rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`} dangerouslySetInnerHTML={{ __html: link.label }} preserveScroll preserveState />
                        ) : (
                            <span key={index} className="mx-1 px-3 py-1 border rounded bg-gray-100 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}

// Layout permanen
Welcome.layout = page => <PublicLayout children={page} />;