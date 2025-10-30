// resources/js/Pages/Admin/Books/CreateEdit.jsx

import React, { useEffect } from 'react';
// 👇 1. UBAH IMPORT LAYOUT INI
// import AdminLayout from '@/Layouts/AdminLayout'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
// 👆 ---
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
// Import TextArea dari folder Components
import TextArea from '@/Components/TextArea'; 

const COVER_BASE_URL = '/storage/'; 

// Hapus 'auth' dari props
export default function CreateEdit({ book, categories }) { 
    const isEditing = !!book; 
    const headerTitle = isEditing ? `Edit Buku: ${book.title}` : 'Tambah Buku Baru';

    const { data, setData, post, processing, errors, reset, progress } = useForm({ // Tambahkan progress untuk upload
        title: book?.title || '',
        author: book?.author || '',
        category_id: book?.category_id || '',
        description: book?.description || '',
        language: book?.language || '',
        publisher: book?.publisher || '',
        year: book?.year || '',
        isbn: book?.isbn || '',
        cover_file: null,
        pdf_file: null,
        // _method diperlukan Inertia saat mengirim file via POST untuk route PUT/PATCH
        _method: isEditing ? 'put' : 'post', 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gunakan POST untuk create dan update (karena ada file upload)
        // Laravel akan menghandle _method: 'put'
        const url = isEditing ? route('admin.books.update', book.id) : route('admin.books.store');
        post(url, {
             // forceFormData: true, // Tidak perlu, Inertia otomatis deteksi file
             preserveScroll: true, // Jaga scroll saat validasi error
             onSuccess: () => reset(), // Reset form jika sukses
        });
    };

    // 👇 2. GANTI WRAPPER <AdminLayout> DENGAN FRAGMENT <>
    return (
        <>
            <Head title={headerTitle} />

            {/* 👇 4. TAMBAHKAN DIV PEMBUNGKUS UTAMA (KARTU) 👇 */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            {/* 👆 --- 👆 */}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Kiri: Metadata Utama */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Data Metadata</h3>
                            
                            {/* Judul */}
                            <div className="mb-4">
                                <InputLabel htmlFor="title" value="Judul Buku (*)" />
                                <TextInput id="title" type="text" className="mt-1 block w-full" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                                <InputError message={errors.title} className="mt-2" />
                            </div>
                            
                            {/* Penulis */}
                            <div className="mb-4">
                                <InputLabel htmlFor="author" value="Penulis (*)" />
                                <TextInput id="author" type="text" className="mt-1 block w-full" value={data.author} onChange={(e) => setData('author', e.target.value)} required />
                                <InputError message={errors.author} className="mt-2" />
                            </div>

                            {/* Kategori */}
                            <div className="mb-4">
                                <InputLabel htmlFor="category_id" value="Kategori" />
                                <select id="category_id" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}>
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                </select>
                                <InputError message={errors.category_id} className="mt-2" />
                            </div>

                            {/* Deskripsi */}
                            <div className="mb-4">
                                <InputLabel htmlFor="description" value="Deskripsi" />
                                {/* Gunakan komponen TextArea */}
                                <TextArea id="description" rows="4" className="mt-1 block w-full" value={data.description} onChange={(e) => setData('description', e.target.value)} /> 
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>

                        {/* Kolom Kanan: Detail & File */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Detail dan File</h3>

                            {/* Penerbit & Tahun */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel htmlFor="publisher" value="Penerbit" />
                                    <TextInput id="publisher" type="text" className="mt-1 block w-full" value={data.publisher} onChange={(e) => setData('publisher', e.target.value)} />
                                    <InputError message={errors.publisher} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="year" value="Tahun Terbit" />
                                    <TextInput id="year" type="number" className="mt-1 block w-full" value={data.year} onChange={(e) => setData('year', e.target.value)} />
                                    <InputError message={errors.year} className="mt-2" />
                                </div>
                            </div>

                            {/* ISBN & Bahasa */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel htmlFor="isbn" value="ISBN" />
                                    <TextInput id="isbn" type="text" className="mt-1 block w-full" value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} />
                                    <InputError message={errors.isbn} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="language" value="Bahasa" />
                                    <TextInput id="language" type="text" className="mt-1 block w-full" value={data.language} onChange={(e) => setData('language', e.target.value)} />
                                    <InputError message={errors.language} className="mt-2" />
                                </div>
                            </div>
                            
                            {/* Upload Cover */}
                            <div className="mb-4">
                                <InputLabel htmlFor="cover_file" value={`Cover Buku ${isEditing ? '(Abaikan jika tidak diubah)' : '(*)'}`} />
                                <input id="cover_file" type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={(e) => setData('cover_file', e.target.files[0])} accept="image/*" /> {/* Tambahkan accept */}
                                {progress && progress.percentage && ( // Tampilkan progress upload
                                    <progress value={progress.percentage} max="100" className="w-full mt-1">
                                        {progress.percentage}%
                                    </progress>
                                )}
                                <InputError message={errors.cover_file} className="mt-2" />
                                {isEditing && book.cover_path && !data.cover_file && (
                                    <p className="mt-2 text-sm text-gray-500">Cover saat ini: <a href={COVER_BASE_URL + book.cover_path} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Lihat Gambar</a></p>
                                )}
                            </div>

                            {/* Upload PDF */}
                            <div className="mb-4">
                                <InputLabel htmlFor="pdf_file" value={`File PDF Buku ${isEditing ? '(Abaikan jika tidak diubah)' : '(*)'}`} />
                                <input id="pdf_file" type="file" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={(e) => setData('pdf_file', e.target.files[0])} accept=".pdf" /> {/* Tambahkan accept */}
                                {progress && progress.percentage && ( // Tampilkan progress upload (jika perlu dibedakan)
                                    <progress value={progress.percentage} max="100" className="w-full mt-1">
                                         {progress.percentage}%
                                    </progress>
                                )}
                                <InputError message={errors.pdf_file} className="mt-2" />
                                {isEditing && book.file_path && !data.pdf_file && (
                                    <p className="mt-2 text-sm text-gray-500">File saat ini: <a href={route('books.file', book.id)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Lihat PDF</a></p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <Link href={route('admin.books.index')} className="mr-4 text-gray-600 hover:text-gray-800">
                            Batal
                        </Link>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Buku')}
                        </PrimaryButton>
                    </div>
                </form>
            
            {/* 👇 AKHIR DIV PEMBUNGKUS UTAMA 👇 */}
            </div>
            {/* 👆 --- 👆 */}

        </> // <-- Ganti </AdminLayout> dengan </>
    );
}

// 👇 3. TAMBAHKAN DEFINISI LAYOUT PERMANEN INI
CreateEdit.layout = page => {
    // Ambil judul dari props halaman (book ada jika edit, tidak ada jika create)
    const bookTitle = page.props.book?.title;
    const headerText = bookTitle ? `Edit Buku: ${bookTitle}` : 'Tambah Buku Baru';
    
    return (
        <AuthenticatedLayout 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{headerText}</h2>}
        >
            {page}
        </AuthenticatedLayout>
    );
};
// 👆 ---