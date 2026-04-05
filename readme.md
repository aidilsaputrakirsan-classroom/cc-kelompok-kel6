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


### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                         │
│                  (Vite React Frontend)                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   NGINX GATEWAY (Port 80)                    │
│              Reverse Proxy & Load Balancing                  │
├──────────┬──────────┬──────────┬────────────────────────────┤
│          │          │          │                            │
▼          ▼          ▼          ▼                            ▼
┌────────────┐ ┌────────────┐ ┌────────────┐         ┌──────────────┐
│ Auth Srv   │ │ Finance    │ │ Letter     │         │ Frontend     │
│ :8000      │ │ Srv :8000  │ │ Srv :8000  │         │ :5173        │
└─────┬──────┘ └─────┬──────┘ └─────┬──────┘         └──────────────┘
      │              │              │
      └──────────────┴──────────────┘
              │ Inter-service API calls
              │ (verify token)
              ▼
         ┌──────────────────┐
         │ Auth Service     │
         │ /verify endpoint │
         └──────────────────┘
              │
      ┌───────┴───────┬───────────┬─────────────┐
      ▼               ▼           ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ auth_db  │  │finance_db│  │letter_db │  │          │
│ Users    │  │ Cat/Txns │  │ Letters  │  │  (more)  │
│          │  │          │  │ Counters │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
PostgreSQL Databases (3 separate instances)
```

### Service Communication

**Authentication Flow**

```
1. Client Submits Credentials
   POST /auth/login {username, password}
         │
         ▼
   ┌──────────────────┐
   │ Auth Service     │
   │ - Verify creds   │
   │ - Create JWT     │
   └──────────────────┘
         │
         ▼
   Return: {
     access_token: "JWT_TOKEN",
     token_type: "bearer",
     user: {...}
   }

2. Client Stores Token & Sends with Requests
   GET /finance/transactions?token=JWT_TOKEN
         │
         ▼
   ┌──────────────────────┐
   │ Finance Service      │
   │ 1. Extract token     │
   │ 2. Call Auth verify  │
   │    /auth/verify?     │
   │    token=JWT_TOKEN   │
   └──────────────────────┘
         │
         ▼
   ┌──────────────────┐
   │ Auth Service     │
   │ - Decode JWT     │
   │ - Return user    │
   │   data & role    │
   └──────────────────┘
         │
         ▼
   Finance Service:
   - Check user role
   - Return transactions
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


---

# 📡 API Documentation

## 1️⃣ POST
### POST /items
Endpoint ini digunakan untuk menambahkan item baru ke dalam sistem inventory.<p>
**Method** <br>
    
    POST

**URL**

    /items

**Request Body** <p>
Item 1 (Laptop) :
```
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5
}
```
Item 2 (Mouse) : 
```
{
  "name": "Mouse Wireless",
  "description": "Mouse bluetooth",
  "price": 25000,
  "quantity": 20
}
```
Item 3 (Keyboard) :
```
{
  "name": "Keyboard Mechanical",
  "description": "Keyboard untuk coding",
  "price": 1200000,
  "quantity": 8
}
```

**Response Example** <p>
Item 1 (Laptop) : 
```
{
  "id": 9,
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5
}
```
Item 2 (Mouse) : 
```
{
  "id": 10,
  "name": "Mouse Wireless",
  "description": "Mouse bluetooth",
  "price": 25000,
  "quantity": 20
}
```
Item 3 (Keyboard) :
```
{
  "id": 11,
  "name": "Keyboard Mechanical",
  "description": "Keyboard untuk coding",
  "price": 1200000,
  "quantity": 8
}
```

---

## 2️⃣ GET
### GET /items
Endpoint ini digunakan untuk mengambil seluruh daftar item yang tersimpan di dalam sistem inventory. Biasanya digunakan ketika pengguna ingin melihat semua item yang tersedia di database.<p>
**Method** <br>
    
    GET

**URL**

    /items

**Request Body** <p>
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
      "price": 250000,
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

### GET /items/{item_id}
Endpoint ini digunakan untuk mengambil data satu item tertentu berdasarkan ID dan biasanya digunakan ketika pengguna ingin melihat detail dari satu item secara spesifik.

**Method** <br>

    GET

**URL**

    /items/{item_id}

*Note* :<br> Nilai id berupa angka (integer) yang mewakili identitas unik dari setiap item. Sebagai contoh, jika pengguna melakukan request GET /items/1, maka sistem akan mencari dan menampilkan data item yang memiliki ID bernilai 1 di dalam database.

**Request Body** <p>
Endpoint ini tidak memerlukan request body karena hanya digunakan untuk mengambil data berdasarkan ID.

**Response Example**
```
{
  "id": 11,
  "name": "Keyboard Mechanical",
  "description": "Keyboard untuk coding",
  "price": 1200000,
  "quantity": 8,
  "created_at": "2026-03-07T21:59:34.163510+08:00",
  "updated_at": null
}
```

### GET /items/stats
Endpoint ini digunakan untuk mengambil data statistik dari seluruh item yang tersimpan di sistem inventory dan membantu pengguna untuk melihat ringkasan data inventory tanpa harus melihat setiap item secara detail. <p>
**Method** <br>

    GET

**URL** <br>

    /items/stats

**Request Body** <p>
Endpoint ini tidak memerlukan request body karena hanya digunakan untuk mengambil data statistik dari seluruh item yang tersimpan di sistem.

**Response Example**
```
{
  "total_items": 3,
  "total_quantity": 33,
  "total_value": 89600000,
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

---

## 3️⃣ PUT
### PUT /items/{item_id}
Endpoint ini digunakan untuk memperbarui data item yang sudah ada di dalam sistem inventory berdasarkan ID item. <p>
**Method** 

    PUT

**URL**

    /items/{item_id}

*Note* :<br> Nilai id berupa angka (integer) yang mewakili identitas unik dari setiap item. Sebagai contoh, jika pengguna melakukan request PUT /items/1, maka sistem akan memperbarui data item yang memiliki ID bernilai 1 di dalam database dengan data terbaru yang dikirim melalui request body.

**Request Body**<p>
Pengguna ingin mengubah harga laptop yang sebelumnya 15000000 menjadi 14000000.
```
{
  "id": 9,
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 14000000,
  "quantity": 5
}
```

**Response Example** <br>
Harga laptop akan berubah menjadi 14000000 sesuai yang telah diubah oleh pengguna.
```
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 14000000,
  "quantity": 5,
  "id": 9,
  "created_at": "2026-03-07T21:59:34.163510+08:00",
  "updated_at": "2026-03-08T10:45:00+08:00"
}
```

---

## 4️⃣ DELETE
### DELETE /items/{item_id} 
Endpoint ini digunakan untuk menghapus item tertentu dari sistem inventory berdasarkan ID.
Ketika endpoint ini dipanggil, sistem akan mencari item yang memiliki ID sesuai dan kemudian menghapusnya dari database.<p>
**Method**

    DELETE

**URL**

    /items/{item_id}

**Request Body** <p>
Endpoint ini tidak memerlukan request body karena hanya membutuhkan ID item pada URL.

**Response Example**
```
{
  "message": "Item successfully deleted"
}
```

----

# 🔐 Authentication
----
## 📡 API Endpoint
### 🌐 Public Endpoints
Public endpoints adalah endpoint yang bisa diakses tanpa login atau autentikasi. Endpoint ini biasanya digunakan untuk proses awal seperti register, login, atau pengecekan status server. Karena tidak membutuhkan token, siapa saja dapat mengakses endpoint ini. <p>
| Method | Endpoint         | Deskripsi          |
| ------ | ---------------- | ------------------ |
| GET    | `/health`        | Cek status API     |
| POST   | `/auth/register` | Register user baru |
| POST   | `/auth/login`    | Login user         |

### 🔐 Protected Endpoints
Protected endpoints adalah endpoint yang hanya bisa diakses oleh user yang sudah login. Untuk mengaksesnya, user harus menyertakan token (Bearer Token) pada header request. <p>

| Method | Endpoint      | Deskripsi             |
| ------ | ------------- | --------------------- |
| GET    | `/auth/me`    | Ambil data user login |
| POST   | `/items`      | Tambah item           |
| GET    | `/items`      | Ambil semua item      |
| GET    | `/items/{id}` | Ambil detail item     |
| PUT    | `/items/{id}` | Update item           |
| DELETE | `/items/{id}` | Hapus item            |

---

## 🔍 Testing Authentication
### 1️⃣ Login page muncul ?
**Endpoint** : - <p>
**Langkah** : <br>
1. Pengguna mengakses http://localhost:5173/ <p>

**Hasil Aktual** : Halaman Login berhasil ditampilkan <p>
Ketika aplikasi diakses melalui localhost:5173, sistem berhasil menampilkan halaman login sebagai tampilan awal. Hal ini menunjukkan bahwa routing aplikasi berjalan dengan baik dan halaman autentikasi dapat diakses tanpa kendala.


### 2️⃣ Register User Baru
**Endpoint** : 
```
POST /auth/register
```
**Langkah** : <br>
1. Klik register
2. Input data user berupa Nama Lengkap, Email, dan Password
3. Klik tombol Register <p>

**Hasil Aktual** : Akun user berhasil tersimpan dan mengakses aplikasi <p>
Proses register user baru berhasil dilakukan, dimana data user yang diinput berhasil dikirim ke endpoint POST /register dan tersimpan di database.

### 3️⃣ Otomatis Login Setelah Register
**Endpoint** : 
```
POST /auth/register
```
**Langkah** : <br>
1. Selesaikan proses register<p>

**Hasil Aktual** : User berhasil masuk aplikasi tanpa login ulang <p>
Setelah proses registrasi selesai, sistem secara otomatis melakukan login dengan membuat session. Pengguna langsung diarahkan ke halaman utama tanpa perlu login ulang, menandakan fitur auto-authentication berjalan dengan baik.

### 4️⃣ Main app + Items muncul?
**Endpoint** : 
``` 
GET /items
```

**Hasil Aktual** : <p>
Setelah login, sistem berhasil menampilkan halaman utama beserta data items yang diambil dari endpoint GET /items. Hal ini menunjukkan integrasi antara frontend dan backend berjalan dengan baik.

### 5️⃣ Nama user di header?
**Endpoint** : 
``` 
GET /auth/me
```
**Hasil Aktual** : <p>
Nama user yang sedang login berhasil ditampilkan pada bagian header aplikasi. Ini membuktikan bahwa data user dapat diambil dari backend dan ditampilkan dengan benar di sisi frontend.

### 6️⃣ CRUD items berfungsi
**Endpoint** : 
``` 
POST /items
GET /items
GET /items/{item_id}
PUT /items/{item_id}
DELETE /items/{item_id}
```
**Hasil Aktual** : <p>
Seluruh operasi CRUD (Create, Read, Update, Delete) berhasil dijalankan. Data berhasil ditambahkan, ditampilkan, diperbarui, dan dihapus melalui endpoint yang tersedia. Perubahan data juga langsung terlihat di tampilan aplikasi.

### 7️⃣ Klik logout
**Endpoint** : - <p>
**Hasil Aktual** : <p>
Fitur logout berhasil dijalankan, dimana ketika tombol logout diklik, sistem menghapus session pengguna dan mengakhiri akses ke aplikasi.

### 8️⃣ Kembali ke Login Page
**Endpoint** : - <p>
**Hasil Aktual** : <p>
Setelah logout, pengguna secara otomatis diarahkan kembali ke halaman login. Hal ini menunjukkan bahwa proteksi halaman (authentication guard) berjalan dengan baik.

### 9️⃣ Login dengan akun tadi
**Endpoint** : 
``` 
POST /auth/login
```
**Hasil Aktual** : <p>
Pengguna dapat login kembali menggunakan akun yang telah dibuat sebelumnya melalui endpoint. Proses autentikasi berhasil dan pengguna diarahkan ke halaman utama.

### 🔟 Data items masih ada?
**Endpoint** : 
``` 
GET /items
```
**Hasil Aktual** : <p>
Setelah login ulang, data items tetap tersedia dan tidak hilang. Hal ini menunjukkan bahwa data disimpan secara permanen di database (persistent) dan tidak bergantung pada session sementara.