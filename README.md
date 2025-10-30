# E-Library (Aplikasi Perpustakaan Digital)

E-Library adalah aplikasi web manajemen buku digital yang dibangun menggunakan Laravel dan React (via Inertia.js). Aplikasi ini memungkinkan admin untuk mengelola buku (CRUD), kategori, dan memantau statistik, sementara pengguna dapat mencari, memfilter, membaca (mengunduh), memfavoritkan, dan memberikan ulasan pada buku.

![Screenshot Dashboard Admin E-Library](https://ALAMAT_SCREENSHOT_MU/image.png)
*(Ganti URL di atas dengan URL screenshot dashboard admin-mu setelah kamu mengunggahnya ke suatu tempat, atau hapus baris ini)*

---

## Fitur Utama

* **Autentikasi:** Registrasi, Login, Verifikasi Email (via Mailpit), dan Reset Password.
* **Role Management:** Peran Admin dan User dengan hak akses terpisah (Middleware).
* **Manajemen Buku (Admin):** CRUD lengkap untuk buku, termasuk upload file sampul (cover) dan file PDF.
* **Manajemen Kategori (Admin):** CRUD dinamis untuk kategori buku menggunakan modal.
* **Dashboard Admin:** Tampilan statistik (Total Buku, User, dll.) dan grafik Chart.js (Distribusi Rating).
* **Dashboard User:** Menampilkan ringkasan aktivitas personal (Ulasan Terbaru, Riwayat Baca, Buku Favorit).
* **Pencarian & Filter:** Pengguna dapat mencari buku berdasarkan judul/penulis dan memfilter berdasarkan kategori.
* **Fitur Interaktif:** Pengguna dapat memberi Rating (1-5 bintang), menulis Ulasan, dan menambah/menghapus Favorit.
* **Riwayat Baca:** Sistem otomatis mencatat buku yang terakhir kali diakses pengguna.

---

## Teknologi & Library yang Digunakan

**Backend (PHP)**
* **Laravel** (v9/v10) - Framework PHP
* **Inertia.js (Adapter)** - Penghubung Laravel ke React
* **PostgreSQL** (atau MySQL) - Database
* **Laravel Breeze** - Scaffolding Autentikasi
* **Ziggy** - Menggunakan route Laravel di JavaScript
* **FakerPHP** - Untuk data dummy (Seeder)

**Frontend (JavaScript)**
* **React.js** - Library UI
* **Vite** - Build tool frontend
* **Tailwind CSS** - Framework CSS
* **Chart.js** & **react-chartjs-2** - Grafik untuk Dashboard Admin

**Development**
* **Mailpit** (atau MailHog) - Server SMTP lokal untuk testing email
* **Docker** (Opsional, untuk Mailpit)

---

## Instalasi (Lokal)

Berikut langkah-langkah untuk menjalankan proyek ini di lingkungan *development* lokal.

## Instalasi (Lokal)

Berikut langkah-langkah untuk menjalankan proyek ini di lingkungan *development* lokal.

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/](https://github.com/)[username]/[nama-repo].git
    cd [nama-repo]
    ```

2.  **Setup Backend (PHP)**
    ```bash
    # Install dependensi PHP
    composer install
    
    # Salin file environment
    cp .env.example .env
    
    # Buat kunci aplikasi
    php artisan key:generate
    ```

3.  **Konfigurasi `.env`**
    Buka file `.env` dan sesuaikan pengaturan koneksi database (DB) dan Mailpit (lihat contoh di atas).

4.  **Setup Frontend (Node.js)**
    ```bash
    # Install dependensi Node.js
    npm install
    ```

5.  **Persiapan Folder Storage (WAJIB)**
    * Buat folder `covers` dan `pdfs` di dalam `storage/app/public/`.
        ```bash
        # (Otomatis) Menjalankan perintah ini juga akan membuat folder jika belum ada
        php artisan storage:link
        ```
    * **PENTING (Untuk Seeder):** Buat satu file PDF kosong, beri nama `dummy_book.pdf`, dan letakkan di dalam `storage/app/public/pdfs/`.
    * **(Opsional - Untuk Cover):** Buat folder `samples` di dalam `storage/app/public/covers/`. Letakkan beberapa gambar (JPG/PNG) di dalamnya agar *seeder* bisa mengambil *cover* acak.

6.  **Migrasi & Seeding Database**
    ```bash
    # Jalankan migrasi untuk membuat struktur tabel
    php artisan migrate
    
    # Jalankan seeder (termasuk 100 buku dummy)
    # Ini akan gagal jika 'dummy_book.pdf' dari langkah 5 tidak ada
    php artisan db:seed
    ```

7.  **Jalankan Server**
    Buka dua terminal terpisah:
    * **Terminal 1 (Server Laravel):** `php artisan serve`
    * **Terminal 2 (Server Vite):** `npm run dev`

8.  **Akses Aplikasi**
    * Buka aplikasi di: `http://localhost:8000`
    * Akses Mailpit (jika berjalan) di: `http://localhost:8025`

    # Kredensial Default (Hasil Seeder)

* **Admin:**
    * Email: `admin@elibrary.test`
    * Password: `password`
    *(Tambahkan akun admin lain jika ada)*

* **User:**
    * Bisa dibuat melalui halaman registrasi (gunakan Mailpit untuk verifikasi).