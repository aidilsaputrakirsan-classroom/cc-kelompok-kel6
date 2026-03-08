# ☁️ Cloud App - SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI)

Sistem ini adalah sistem yang dirancang untuk membantu para pengurus Himpunan Mahasiswa Sistem Informasi (HMSI) dalam mengelola keuangan dan administrasi organisasi secara terintegrasi dalam satu platform. Melalui sistem ini, bendahara dapat mencatat dana masuk dan dana keluar sehingga arus kas (cash flow) dapat terpantau dan terupdate secara otomatis. Selain itu, sistem juga menyediakan fitur pengelolaan surat masuk dan surat keluar, termasuk penomoran surat serta pengelolaan tanda tangan dari Ketua Himpunan Sistem Informasi (HMSI) secara digital. Dengan demikian, seluruh data keuangan dan administrasi dapat tersimpan dengan rapi dan terstruktur.

Aplikasi ini ditujukan bagi seluruh pengurus HMSI untuk mendukung transparansi, ketertiban, dan efisiensi dalam pengelolaan organisasi. Sistem ini hadir sebagai solusi atas permasalahan pencatatan manual yang sering tidak terorganisir, sulit direkap, dan kurang transparan. Dengan adanya sistem yang terintegrasi, proses pelaporan dan administrasi menjadi lebih akurat, praktis, dan mudah diakses ketika dibutuhkan.

## 👥 Tim Kelompok 6

| Nama | NIM | Peran |
|------|-----|-------|
| Achmad Bayhaqi | 10231001 | Lead Backend |
| Indah Nur Fortuna | 10231044 | Lead Frontend |
| Alfiani Dwiyuniarti | 10231010 | Lead DevOps |
| Zahwa Hanna Dwi Putri | 10231092 | Lead CI/CD & Deploy |
| Nilam Ayu NandaStari Romdoni | 10231070 | Lead QA & Docs |

## 🛠️ Tech Stack

| Teknologi | Fungsi | Keterangan |
|-----------|--------|------------|
| FastAPI   | Backend REST API | Membangun dan menyediakan endpoint API yang menangani proses bisnis, validasi data, dan komunikasi dengan database |
| React     | Frontend SPA | Membangun tampilan antarmuka pengguna yang interaktif dan mengonsumsi data dari backend API |
| PostgreSQL | Database | Menyimpan, mengelola, dan mengambil data aplikasi secara terstruktur |
| Docker    | Containerization | Menjalankan aplikasi dalam container agar environment development dan production tetap konsisten |
| GitHub Actions | CI/CD | Melakukan otomatisasi proses pembangunan aplikasi, pengujian, serta penerapan sistem setiap kali terjadi perubahan pada kode |
| Railway/Render | Cloud Deployment | Layanan cloud untuk mendistribusikan dan menjalankan aplikasi pada server secara online |

## 🏗️ Architecture

```
[React Frontend] <--HTTP--> [FastAPI Backend] <--SQL--> [PostgreSQL]
```

*(Diagram ini akan berkembang setiap minggu)*

## 🚀 Prasyarat

Sebelum aplikasi **SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI)** dijalankan, terdapat beberapa perangkat lunak yang perlu diinstal. Prasyarat ini dibutuhkan karena sistem dikembangkan menggunakan arsitektur full-stack, yaitu backend dan frontend yang berjalan secara terpisah namun saling terhubung.

### 1. Python 3.10+

Python digunakan untuk menjalankan sisi backend aplikasi. Pada sistem ini, backend dibangun menggunakan framework **FastAPI** yang berjalan di atas Python. Seluruh proses utama seperti pencatatan pemasukan, pengeluaran, setoran, pengelolaan surat, hingga pengolahan data yang terhubung ke database diproses melalui backend ini.

Versi Python 3.10 atau lebih baru digunakan agar kompatibel dengan library dan fitur modern yang digunakan dalam pengembangan. Selain itu, versi terbaru juga memberikan performa yang lebih stabil dan dukungan keamanan yang lebih baik.

Tanpa Python, backend tidak dapat dijalankan sehingga sistem tidak bisa memproses data keuangan maupun administrasi.

---

### 2. Node.js 18+

Node.js diperlukan untuk menjalankan sisi frontend aplikasi yang dibangun menggunakan **React** dan Vite. Frontend berfungsi sebagai antarmuka yang digunakan oleh pengurus HMSI untuk mengakses sistem melalui browser.

Node.js digunakan untuk:
- Mengelola dependency proyek menggunakan npm
- Menjalankan server pengembangan (development server)
- Melakukan proses build aplikasi sebelum deployment

Penggunaan Node.js versi 18+ bertujuan untuk memastikan kompatibilitas dengan versi React dan tools modern yang digunakan, serta menghindari kendala error pada dependency.

Tanpa Node.js, tampilan sistem tidak dapat dijalankan sehingga pengguna tidak dapat mengakses fitur yang tersedia.

---

### 3. Git

Git digunakan sebagai sistem version control dalam pengembangan proyek ini. Karena aplikasi dikembangkan secara tim, Git berperan penting untuk mengatur perubahan kode, menyimpan riwayat pengembangan, serta menghindari konflik ketika beberapa anggota bekerja pada waktu yang sama.

Melalui Git, setiap anggota dapat melakukan commit, push, dan pull perubahan ke repository GitHub Classroom. Hal ini juga mendukung transparansi kontribusi masing-masing anggota dalam proyek. Tanpa Git, proses kolaborasi dan pengelolaan versi kode akan sulit dilakukan secara terstruktur.

Dengan memenuhi seluruh prasyarat di atas, aplikasi SIKASI dapat dijalankan secara optimal baik pada sisi backend maupun frontend, serta mendukung proses pengembangan yang terstruktur dan kolaboratif.

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```



---

# 🚀 Project Setup Guide

## 1️⃣ Backend Setup

Masuk ke folder backend:

```bash
cd backend
```

### Buat Environment Variables (.env)

Buat file .env di dalam folder backend/.

Contoh isi:
```
# Database
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/cloudapp

# JWT
SECRET_KEY=ganti-dengan-random-string-panjang-minimal-32-karakter
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Catatan Penting

- Pastikan PostgreSQL sudah berjalan.
- Buat database cloudapp terlebih dahulu.
- Jangan commit file .env. Tambahkan ke .gitignore.
- Gunakan openssl rand -hex 32 untuk generate SECRET_KEY.

### Buat Virtual Environment (venv)

```bash
python -m venv venv
```

### Aktivasi Virtual Environment

**Mac / Linux**

```bash
source venv/bin/activate
```

**Windows (PowerShell)**

```bash
venv\Scripts\Activate
```

Kalau berhasil aktif, terminal akan menampilkan `(venv)` di depan.
Kalau tidak ada, berarti belum aktif. Jangan install dependency secara global.

---

### Install Dependencies

Pastikan file `requirements.txt` tersedia, contoh:

```txt
fastapi==0.115.0
uvicorn==0.30.0
...
```

Install dengan:

```bash
pip install -r requirements.txt
```

Jika muncul error `pip not found`, kemungkinan Python belum terdaftar di PATH.

---

### Jalankan Backend Server

Masih di dalam folder `backend`:

```bash
uvicorn main:app --reload --port 8000
```

Server akan berjalan di:

```
http://localhost:8000
```

---

## 2️⃣ Frontend Setup

Masuk ke folder frontend:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Biasanya akan berjalan di:

```
http://localhost:5173
```

---

## 3️⃣ Git Useful Alias

Biar nggak ribet ngetik panjang-panjang tiap mau lihat riwayat commit, bikin alias ini:

```bash
git config --global alias.graph "log --all --decorate --oneline --graph"
```

Penjelasan singkat:

* `--all` → tampilkan semua branch
* `--decorate` → tampilkan nama branch & tag
* `--oneline` → ringkas satu baris per commit
* `--graph` → tampilkan struktur percabangan dalam bentuk grafik ASCII

Setelah itu, cukup jalankan:

```bash
git graph
```
Lalu bisa melihat seluruh riwayat commit lengkap dengan visual branching-nya.


# 📡 API Documentation
## 1️⃣ GET
### GET /Items
Mengembalikan 3 items dengan total : 3 <p>
**Method** <br>
    
    GET

**URL**

    /items

**Request Body**<br>
Endpoint ini tidak memerlukan request body karena hanya digunakan untuk mengambil daftar item.

**Response Example**
```
{
  "total": 3,
  "items": [
    {
      "name": "Keyboard Mechanical",
      "description": "Keyboard untuk coding",
      "price": 1200000,
      "quantity": 8,
      "id": 11,
      "created_at": "2026-03-07T21:59:34.163510+08:00",
      "update_at": null
    },
    {
      "name": "Mouse Wireless",
      "description": "Mouse bluetooth",
      "price": 25000,
      "quantity": 20,
      "id": 10,
      "created_at": "2026-03-07T21:58:15.651992+08:00",
      "update_at": null
    },
    {
      "name": "Laptop",
      "description": "Laptop untuk cloud computing",
      "price": 15000000,
      "quantity": 5,
      "id": 9,
      "created_at": "2026-03-07T21:56:13.996353+08:00",
      "update_at": null
    }
  ]
}
```

### GET /Items/stats
Mengembalikan statistik 3 data items. <p>
**Method** <br>

    GET

**URL** <br>

    /items/stats

**Request Body** <br>
Endpoint ini tidak memerlukan request body karena hanya digunakan untuk mengambil data statistik dari seluruh item yang tersimpan di sistem.

**Response Example** <br>
```
{
  "total_items": 3,
  "total_quantity": 33,
  "total_value": 17800000,
  "most_expensive_item": "Laptop",
  "cheapest_item": "Mouse Wireless"
}
```
Penjelasan : <br>
| Field | Keterangan |
|-------|------------|
|total_items|jumlah jenis item|
|total_quantity|total semua stok item|
|total_value|total nilai semua barang|
|most_expensive_item|item dengan harga tertinggi|
|cheapest_item|item dengan harga terendah|


