# Michael Aristyo — Full-Stack Portfolio Website

Website portofolio full-stack yang modern, minimalis, dan dinamis. Dibangun menggunakan ekosistem **React (Vite)** di bagian frontend, **Prisma ORM** dengan **Supabase (PostgreSQL)** untuk penyimpanan database, serta diintegrasikan dengan **Gemini AI API** untuk fitur-fitur pintar.

---

## 🚀 Fitur Utama
- **Project Showcase:** Galeri portofolio interaktif dengan filter proyek unggulan (*featured*).
- **Lab Life Gallery:** Dokumentasi aktivitas asisten laboratorium dalam format mosaik/grid visual yang rapi.
- **Dynamic Case Study:** Halaman detail proyek mendalam yang ditarik secara real-time dari database.
- **Modern UI/UX:** Desain premium, efek *glassmorphism*, dan animasi super halus menggunakan **Tailwind CSS v4** dan **Framer Motion**.

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
| --- | --- |
| **Frontend / UI** | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Database & ORM** | Supabase (PostgreSQL), Prisma ORM |
| **Integrasi AI** | Gemini AI SDK (`@google/genai`) |
| **Runtime & Bundler** | Node.js, TypeScript, Esbuild |

---

## 📋 Prasyarat (*Prerequisites*)

Sebelum menjalankan project secara lokal, pastikan Anda telah menginstal/menyiapkan:
1. **Node.js** (versi 18.x atau yang lebih baru).
2. Akun dan project **Supabase** (atau PostgreSQL lainnya).
3. API Key dari **Google AI Studio (Gemini)**.

---

## ⚙️ Langkah Instalasi & Konfigurasi

### 1. Kloning Project & Pasang Dependensi
Buka terminal Anda dan jalankan perintah berikut:
```bash
# Masuk ke direktori project
cd michael-aristyo-portfolio

# Install semua dependensi Node.js
npm install
```

### 2. Konfigurasi Environment Variables
Salin file template `.env.example` menjadi `.env` baru di direktori root:
```bash
cp .env.example .env
```
Buka file `.env` yang baru dibuat dan isi kredensial berikut:
- **`GEMINI_API_KEY`**: Masukkan API key dari Google AI Studio Anda.
- **`DATABASE_URL`**: String koneksi PostgreSQL dengan *Transaction Pooler* (Port 6543) dari Supabase.
- **`DIRECT_URL`**: String koneksi PostgreSQL *Direct* (Port 5432) dari Supabase.

---

## 🗄️ Setup & Sinkronisasi Database

Project ini menggunakan Prisma ORM untuk mengelola komunikasi data dengan PostgreSQL di Supabase. Ikuti langkah sinkronisasi berikut:

### 1. Jalankan Skrip Migrasi SQL (Supabase)
Sebelum menjalankan backend, jalankan skrip migrasi/setup database yang disediakan di folder root (`supabase-setup.sql`, `supabase-migration-002.sql`, dan `supabase-migration-003.sql`) langsung di **SQL Editor** pada Dashboard Supabase Anda:
* Dashboard Supabase → **SQL Editor** → **New query** → Salin isi file `.sql` → Klik **Run**.

### 2. Sinkronisasikan Schema Prisma ke Database
Jalankan perintah berikut untuk mensinkronkan model `schema.prisma` ke Supabase:
```bash
npx prisma db push
```

### 3. Masukkan Data Uji Coba (*Database Seeding*)
Untuk mengisi database Anda dengan beberapa data proyek dan aktivitas lab contoh, jalankan skrip seed:
```bash
npx tsx prisma/seed.ts
```

---

## 💻 Menjalankan Aplikasi di Lokal

Gunakan perintah-perintah script `npm` berikut untuk mengoperasikan aplikasi:

### Mode Pengembangan (*Development*)
Untuk menjalankan server lokal dengan fitur hot-reload:
```bash
npm run dev
```
Aplikasi akan berjalan dan dapat diakses melalui browser di: **`http://localhost:3000`**

### Validasi TypeScript & Linting
Untuk memeriksa keamanan tipe data (*type safety*) sebelum melakukan deploy:
```bash
npm run lint
```

### Produksi (*Build & Preview*)
1. Kompilasi aplikasi untuk siap di-deploy ke produksi:
   ```bash
   npm run build
   ```
2. Jalankan lokal preview dari hasil build produksi tersebut:
   ```bash
   npm run preview
   ```

---

## 📂 Struktur Direktori Utama

```text
michael-aristyo-portfolio/
├── components/          # Reusable UI components (glass-cards, layout, dll)
├── lib/
│   ├── prisma.ts        # Prisma Client singleton configuration
│   └── data.ts          # Typed server-side data fetching functions
├── prisma/
│   ├── schema.prisma    # Prisma models (Project, LabActivity)
│   └── seed.ts          # Mock database seeding script
├── src/
│   ├── App.tsx          # Main React Application & routing
│   ├── index.css        # Tailwind utility imports & custom globals
│   └── main.tsx         # React DOM mounting
├── .env.example         # Template for environment configuration
├── .gitignore           # Git ignore list (OS, IDE, Backend & Frontend rules)
├── package.json         # Node.js dependencies and run scripts
└── README.md            # Dokumentasi project (File ini)
```
