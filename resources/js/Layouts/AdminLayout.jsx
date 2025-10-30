// resources/js/Layouts/AdminLayout.jsx

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink'; // <-- HAPUS IMPORT KEDUA YANG DUPLIKAT
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function AdminLayout({ children, header }) {
    const { auth, flash } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigasi Admin */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink 
                                    href={route('admin.dashboard')} 
                                    active={route().current('admin.dashboard')}
                                >
                                    Dashboard Admin
                                </NavLink>
                                <NavLink 
                                    href={route('admin.books.index')} 
                                    active={route().current('admin.books.*')}
                                >
                                    Kelola Buku
                                </NavLink>
                                <NavLink 
                                    href={route('admin.categories.index')} 
                                    active={route().current('admin.categories.*')}
                                >
                                    Kelola Kategori
                                </NavLink>

                                {/* 👇 ========================================== 👇 */}
                                {/* TAMBAHAN LINK (DESKTOP)            */}
                                {/* 👇 ========================================== 👇 */}
                                <NavLink 
                                    href={route('dashboard')} 
                                    active={route().current('dashboard')}
                                    className="text-blue-600 hover:text-blue-800" // Opsional
                                >
                                    (Lihat Dashboard User)
                                </NavLink>
                                {/* 👆 ========================================== 👆 */}
                                {/* AKHIR TAMBAHAN                 */}
                                {/* 👆 ========================================== 👆 */}

                            </div>
                        </div>

                        {/* Dropdown User */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name} 

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        
                        {/* Hamburger Menu (Responsive) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigasi Responsive (Mobile) */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                            Dashboard Admin
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.books.index')} active={route().current('admin.books.*')}>
                            Kelola Buku
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('admin.categories.index')} active={route().current('admin.categories.*')}>
                            Kelola Kategori
                        </ResponsiveNavLink>
                        
                        {/* 👇 ========================================== 👇 */}
                        {/* TAMBAHAN LINK (MOBILE)              */}
                        {/* 👇 ========================================== 👇 */}
                        <ResponsiveNavLink 
                            href={route('dashboard')} 
                            active={route().current('dashboard')}
                        >
                            (Lihat Dashboard User)
                        </ResponsiveNavLink>
                        {/* 👆 ========================================== 👆 */}
                        {/* AKHIR TAMBAHAN                 */}
                        {/* 👆 ========================================== 👆 */}

                    </div>

                    {/* Opsi User Responsive (Mobile) */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Konten Utama */}
            <main>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        
                        {/* Flash Messages */}
                        {flash.success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                                {flash.success}
                            </div>
                        )}
                        {flash.error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                                {flash.error}
                            </div>
                        )}
                        
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}