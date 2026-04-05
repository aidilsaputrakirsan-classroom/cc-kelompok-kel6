# Quick Start Guide

## Prasyarat (Prerequisites)
- Docker Desktop installed and running
- Docker Compose (usually comes with Docker Desktop)

## Langkah Menjalankan Aplikasi (Startup Steps)

### 1. Clone Repository & Masuk ke Folder Project
```bash
git clone <your-repo>
cd organization-management-system
```

### 2. Jalankan Semua Service dengan Docker Compose
```bash
docker-compose up --build
```

Perintah ini akan :
- Membuat 3 database PostgreSQL
- Build and start auth-service (port 8000)
- Build and start finance-service (port 8000)
- Build and start letter-service (port 8000)
- Build and start frontend (port 5173)
- Setup Nginx gateway (port 80)

### 3. Tunggu hingga Semua Service Berjalan

Perhatikan log pada terminal. Service sudah siap jika muncul:
- Database health checks passing
- FastAPI services running on 0.0.0.0:8000
- Frontend dev server running

Biasanya membutuhkan waktu sekitar 30-60 detik.

### 4. Akses Aplikasi

Open browser and go to: **`http://localhost`**

Jika berhasil, maka akan mencul halaman login.

## First Time Setup

1. **Registrasi Akun**
   - Klik *Registrasi* pada halaman login
   - Isi username, email, dan password
   - Akun pertama akan memiliki role "Anggota"

2. **Mencoba Fitur**

   Beberapa fitur yang dapat diuji:
   - Dashboard: Melihat ringkasan keuangan
   - Finance: Melihat transaksi dan kategori (read-only untuk Anggota)
   - Letters: Melihat surat (read-only Anggota)

3. **Menguji Fitur Admin** (Optional)
   - Buka akun dengan role Ketua
   - Hentikan container
   - Edit `services/auth-service/main.py` to Menambahkan akun Ketua default saat startup
   - Atau bisa menggunakan API langsung.

## Menghentikan Service

```bash
docker-compose down
```

Untuk menghentikan dan menghapus data pada database: 
```bash
docker-compose down -v
```

## Troubleshooting

### Port Sudah Digunakan
Jika **port 80** sedang digunakan:
```bash
docker-compose down
```

Hentikan proses yang menggunakan port 80, lalu jalankan kembali:
```bash
docker-compose up --build
```

### Service Tidak Dapat Jalan
Periksa log masing-masing service:
```bash
docker-compose logs auth-service
docker-compose logs finance-service
docker-compose logs letter-service
docker-compose logs frontend
```

### Error Koneksi Database
Tunggu sekitar 30 detik, karena database membutuhkan waktu untuk inisialisasi.

Periksa log database:
```bash
docker-compose logs auth-db
```

### Frontend Menampilkan "Cannot GET /"
Tunggu hingga frontend selesai compile.
Perhatikan log hingga muncul pesan "ready in ..."

## Pengujian API

### Menggunakan cURL

1. **Register**
```bash
curl -X POST http://localhost/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'
```

2. **Login**
```bash
curl -X POST http://localhost/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pass123"}'
```

Copy the `access_token` from response.

3. **Melihat Data User**
```bash
curl "http://localhost/auth/me?token=YOUR_TOKEN_HERE"
```

4. **Melihat Cashflow**
```bash
curl "http://localhost/finance/cashflow?token=YOUR_TOKEN_HERE"
```

## Struktur Project

```
.
├── docker-compose.yml          ← File utama orchestrasi
├── services/
│   ├── auth-service/           ← Autentikasi user & JWT
│   ├── finance-service/        ← Manajemen Keuangan
│   ├── letter-service/         ← Manajemen Surat
│   └── gateway/                ← Nginx reverse proxy
└── frontend/                   ← Aplikasi React (Vite)
```

## Fitur yang sudah berfungsi

✅ Registrasi dan login user
✅ Autentikasi JWT
✅ Role-based access control
✅ Manajemen keuangan (Bendahara)
✅ Manajemen surat (Sekretaris)
✅ Manajemen user (Ketua)
✅ Penyimpanan data database
✅ Arsitektur microservices
✅ Routing API gateway


## Next Langkah Selanjutnya

1. Eksplorasi endpoint API pada README.md
2. Buat akun baru dengan role berbeda
3. Uji fitur berdasarkan role
4. Pelajari kode pada folder services/
5. Modifikasi sesuai kebutuhan

## Perintah yang sering digunakan

### Reset Semua Data
```bash
docker-compose down -v
docker-compose up --build
```

### Melihat Log Service
```bash
docker-compose logs -f auth-service
docker-compose logs -f finance-service
docker-compose logs -f letter-service
docker-compose logs -f frontend
```

### Rebild Service Tertentu
```bash
docker-compose up --build auth-service
```

### Mengakses Database
```bash
docker-compose exec auth-db psql -U postgres -d auth_db
```

Perintah di dalam psql:
```
\dt
```
Melihat tabel database.

```
SELECT * FROM users;
```
Melihat data user.


---

**That's it! You now have a fully functional microservices organization management system running locally.**
