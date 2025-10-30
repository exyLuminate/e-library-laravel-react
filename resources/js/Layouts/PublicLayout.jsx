// resources/js/Layouts/PublicLayout.jsx

import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8"> {/* Full-width */}
                    <div className="flex justify-between h-16">
                         {/* 👇 ========================================== 👇 */}
                        {/* BLOK KIRI: Logo + SEMUA Link Navigasi       */}
                        {/* 👇 ========================================== 👇 */}
                        <div className="flex"> {/* Container untuk item kiri */}
                            {/* Logo */}
                            <div className="shrink-0 flex items-center mr-10"> {/* Margin kanan dari logo */}
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                             {/* Semua Link Navigasi Teks (Desktop) */}
                            <div className="hidden space-x-8 sm:-my-px sm:flex items-center"> {/* Container Link */}
                                <NavLink href={route('home')} active={route().current('home')}>
                                    Daftar Buku
                                </NavLink>

                                {user ? (
                                    // JIKA SUDAH LOGIN: Tampilkan Dashboard & Link Admin
                                    <>
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                            Dashboard (User)
                                        </NavLink>
                                        {user.role === 'admin' && (
                                            <>
                                                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')} className="text-red-600 hover:text-red-800">
                                                    Laporan (Dashboard Admin)
                                                </NavLink>
                                                <NavLink href={route('admin.books.index')} active={route().current('admin.books.*')} className="text-red-600 hover:text-red-800">
                                                    Kelola Buku
                                                </NavLink>
                                                <NavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')} className="text-red-600 hover:text-red-800">
                                                    Kelola Kategori
                                                </NavLink>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    // JIKA BELUM LOGIN: Tampilkan Login & Register
                                    <>
                                        <NavLink href={route('login')}>Log in</NavLink>
                                        <NavLink href={route('register')}>Register</NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                         {/* 👆 ========================================== 👆 */}
                        {/* AKHIR BLOK KIRI                             */}
                        {/* 👆 ========================================== 👆 */}


                        {/* BLOK KANAN: Hanya Dropdown User (jika login) */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            {user && ( // Hanya tampilkan dropdown jika sudah login
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md"><button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">{user.name}<svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button></span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                        </div>
                         {/* (Hamburger menu bisa ditambahkan di sini) */}
                    </div>
                </div>
                 {/* (Navigasi Mobile perlu disesuaikan jika ada) */}
            </nav>

            <main>
                 <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                    {children}
                 </div>
            </main>
        </div>
    );
}