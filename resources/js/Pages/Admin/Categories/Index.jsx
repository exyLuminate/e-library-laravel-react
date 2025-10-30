// resources/js/Pages/Admin/Categories/Index.jsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; 
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';

export default function Index({ categories }) { 
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const openCreateModal = () => {
        setIsEditing(false); reset('name'); clearErrors(); setShowModal(true);
    };
    const openEditModal = (category) => {
        setIsEditing(true); setCurrentCategory(category); setData('name', category.name); clearErrors(); setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false); setCurrentCategory(null); reset(); clearErrors();
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => closeModal() };
        if (isEditing) { put(route('admin.categories.update', currentCategory.id), options); } 
        else { post(route('admin.categories.store'), options); }
    };
    const handleDelete = (id) => {
        if (confirm('Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('admin.categories.destroy', id), { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Kelola Kategori" />

            {/* 👇 ========================================================== */}
            {/* TAMBAHKAN DIV PEMBUNGKUS UTAMA INI                      */}
            {/* 👇 ========================================================== */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"> 
            {/* 👆 (Anda bisa sesuaikan padding 'p-6' jika perlu) 👆 */}

                {/* Tombol Tambah */}
                <div className="mb-6 flex justify-end">
                    <PrimaryButton onClick={openCreateModal}>
                        + Tambah Kategori Baru
                    </PrimaryButton>
                </div>

                {/* Tabel Daftar Kategori */}
                {/* Kita hapus bg-white dll dari sini karena sudah ada di parent */}
                <div className="overflow-x-auto"> 
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <DangerButton 
                                            onClick={() => handleDelete(category.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Hapus
                                        </DangerButton>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-gray-500">Belum ada kategori yang ditambahkan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div> 
                
            {/* 👇 ========================================================== */}
            {/* AKHIR DIV PEMBUNGKUS UTAMA                              */}
            {/* 👇 ========================================================== */}
            </div> 
            {/* 👆 --- 👆 */}


            {/* Modal Tambah/Edit (Biarkan di luar div utama) */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {isEditing ? `Edit Kategori: ${currentCategory?.name}` : 'Tambah Kategori Baru'}
                    </h2>
                    <div>
                        <InputLabel htmlFor="name" value="Nama Kategori" />
                        <TextInput
                            id="name" name="name" value={data.name}
                            className="mt-1 block w-full" isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button type="button" onClick={closeModal} className="text-gray-600 mr-4 hover:text-gray-900">
                            Batal
                        </button>
                        <PrimaryButton disabled={processing}>
                             {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Kategori')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </> 
    );
}

// Layout permanen (Biarkan ini)
Index.layout = page => (
    <AuthenticatedLayout 
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Kategori</h2>}
    >
        {page}
    </AuthenticatedLayout>
);