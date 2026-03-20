# API Dokumentasi

Dokumen ini buat menjelaskan semua endpoint yang dipakai di REST API Cloud App. API ini dibangun pakai FastAPI dan PostgreSQL, di sini akan dijelasin setiap endpoint secara rinci mulai dari method, URL, data yang perlu dikirim, sampai contoh respons yang dikembalikan server.

---

## Cara Kerjanya Autentikasi yang Digunakan

Sebagian besar endpoint di API ini memerlukan autentikasi. Sistem autentikasi yang digunakan adalah JWT (JSON Web Token). Langkah kerjanya sebagai berikut:

1. Lakukan registrasi akun melalui endpoint `/auth/register`
2. Login melalui endpoint `/auth/login` untuk mendapatkan token
3. Gunakan token tersebut pada setiap request ke endpoint yang memerlukan autentikasi

Token dikirim melalui header request dengan format ini `Authorization: Bearer <token_yang_didapat_saat_login>`

Token berlaku selama 60 menit. Jika sudah habis masa berlakunya, lakukan login ulang untuk mendapatkan token baru.

---

## End Point Yang Digunakan

| No | Method | Endpoint | Deskripsi | Butuh Token? |
|----|--------|----------|-----------|--------------|
| 1 | GET | `/health` | Cek status server | Tidak |
| 2 | POST | `/auth/register` | Daftar akun baru | Tidak |
| 3 | POST | `/auth/login` | Login dan dapat token | Tidak |
| 4 | GET | `/auth/me` | Lihat profil sendiri | Ya |
| 5 | GET | `/items` | Ambil semua items | Ya |
| 6 | GET | `/items/{item_id}` | Ambil satu item | Ya |
| 7 | GET | `/items/stats` | Statistik items | Ya |
| 8 | POST | `/items` | Buat item baru | Ya |
| 9 | PUT | `/items/{item_id}` | Update item | Ya |
| 10 | DELETE | `/items/{item_id}` | Hapus item | Ya |
| 11 | GET | `/team` | Info anggota tim | Tidak |

---

## Detail/Penjelasan dari End Point

### 1. Health Check

Endpoint ini digunakan untuk memastikan server sedang berjalan dengan normal.

**Method:** GET  
**URL:** `/health`  
**Auth Required:** Tidak  

**Response (200 OK):**
```json
{
  "status": "healthy",
  "version": "0.4.0"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/health
```

---

### 2. Register

Endpoint ini digunakan untuk membuat akun pengguna baru. Setiap email hanya bisa didaftarkan satu kali.

**Method:** POST  
**URL:** `/auth/register`  
**Auth Required:** Tidak  

**Request Body:**

| Field | Tipe Data | Wajib | Ketentuan |
|-------|-----------|-------|-----------|
| email | string | Ya | Harus berformat email yang valid |
| name | string | Ya | Tidak boleh kosong |
| password | string | Ya | Minimal 8 karakter |

Contoh request body:
```json
{
  "email": "hanna@student.itk.ac.id",
  "name": "Zahwa Hanna",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "hanna@student.itk.ac.id",
  "name": "Zahwa Hanna",
  "is_active": true,
  "created_at": "2026-03-21T10:00:00"
}
```

**Response Gagal — Email sudah terdaftar (400 Bad Request):**
```json
{
  "detail": "Email sudah terdaftar"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"hanna@student.itk.ac.id\", \"name\": \"Zahwa Hanna\", \"password\": \"password123\"}"
```

---

### 3. Login

Endpoint ini digunakan untuk masuk ke aplikasi menggunakan email dan password yang sudah didaftarkan. Jika berhasil, server akan mengembalikan token yang digunakan untuk mengakses endpoint lain.

**Method:** POST  
**URL:** `/auth/login`  
**Auth Required:** Tidak  

**Request Body:**

| Field | Tipe Data | Wajib | Ketentuan |
|-------|-----------|-------|-----------|
| email | string | Ya | Email yang sudah terdaftar |
| password | string | Ya | Password akun |

Contoh request body:
```json
{
  "email": "hanna@student.itk.ac.id",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.xxxxxxxx",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "hanna@student.itk.ac.id",
    "name": "Zahwa Hanna",
    "is_active": true,
    "created_at": "2026-03-21T10:00:00"
  }
}
```

Nilai `access_token` pada respons di atas perlu disimpan karena akan digunakan sebagai token di setiap request berikutnya yang memerlukan autentikasi.

**Response Gagal — Email atau password salah (401 Unauthorized):**
```json
{
  "detail": "Email atau password salah"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"hanna@student.itk.ac.id\", \"password\": \"password123\"}"
```

---

### 4. Get Profil Sendiri

Endpoint ini digunakan untuk melihat data profil dari akun yang sedang login.

**Method:** GET  
**URL:** `/auth/me`  
**Auth Required:** Ya  

**Request Body:** Tidak ada  

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "hanna@student.itk.ac.id",
  "name": "Zahwa Hanna",
  "is_active": true,
  "created_at": "2026-03-21T10:00:00"
}
```

**Response Gagal — Tidak menyertakan token (401 Unauthorized):**
```json
{
  "detail": "Not authenticated"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <token_kamu>"
```

---

### 5. Get Semua Item

Endpoint ini mengambil seluruh data item yang tersimpan di database. Tersedia fitur pencarian berdasarkan nama atau deskripsi item, serta pagination untuk membatasi jumlah data yang ditampilkan.

**Method:** GET  
**URL:** `/items`  
**Auth Required:** Ya  

**Request Body:** Tidak ada  

Parameter tambahan yang bisa ditambahkan di URL (opsional):

| Parameter | Tipe Data | Default | Ketentuan |
|-----------|-----------|---------|-----------|
| search | string | — | Kata kunci pencarian (nama atau deskripsi) |
| skip | integer | 0 | Jumlah item yang dilewati, minimal 0 |
| limit | integer | 20 | Jumlah item yang ditampilkan, antara 1-100 |

**Response (200 OK):**
```json
{
  "total": 2,
  "items": [
    {
      "id": 2,
      "name": "Mouse Wireless",
      "description": "Mouse tanpa kabel",
      "price": 150000.0,
      "quantity": 20,
      "created_at": "2026-03-21T10:05:00",
      "updated_at": null
    },
    {
      "id": 1,
      "name": "Laptop ASUS",
      "description": "Laptop untuk kuliah",
      "price": 8500000.0,
      "quantity": 5,
      "created_at": "2026-03-21T10:00:00",
      "updated_at": null
    }
  ]
}
```

Data item diurutkan berdasarkan waktu dibuat, dari yang terbaru ke yang terlama.

**Curl Command — Semua item:**
```bash
curl -X GET http://localhost:8000/items \
  -H "Authorization: Bearer <token_kamu>"
```

**Curl Command — Dengan pencarian:**
```bash
curl -X GET "http://localhost:8000/items?search=laptop" \
  -H "Authorization: Bearer <token_kamu>"
```

**Curl Command — Dengan pagination:**
```bash
curl -X GET "http://localhost:8000/items?skip=0&limit=10" \
  -H "Authorization: Bearer <token_kamu>"
```

---

### 6. Get Satu Item

Endpoint ini mengambil detail data satu item berdasarkan ID-nya.

**Method:** GET  
**URL:** `/items/{item_id}` — ganti `{item_id}` dengan angka ID item, contoh: `/items/1`  
**Auth Required:** Ya  

**Request Body:** Tidak ada  

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop ASUS",
  "description": "Laptop untuk kuliah",
  "price": 8500000.0,
  "quantity": 5,
  "created_at": "2026-03-21T10:00:00",
  "updated_at": null
}
```

**Response Gagal — ID tidak ditemukan (404 Not Found):**
```json
{
  "detail": "Item 1 tidak ditemukan"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/items/1 \
  -H "Authorization: Bearer <token_kamu>"
```

---

### 7. Get Statistik Item

Endpoint ini menampilkan ringkasan statistik dari seluruh item yang ada di database, mencakup total jumlah item, total nilai stok, item dengan harga tertinggi, dan item dengan harga terendah.

**Method:** GET  
**URL:** `/items/stats`  
**Auth Required:** Ya  

**Request Body:** Tidak ada  

**Response (200 OK):**
```json
{
  "total_items": 2,
  "total_value": 45250000.0,
  "most_expensive": {
    "id": 1,
    "name": "Laptop",
    "description": "Lenovo",
    "price": 12000000.0,
    "quantity": 5,
    "created_at": "2026-03-21T10:00:00",
    "updated_at": null
  },
  "cheapest": {
    "id": 2,
    "name": "Mouse Wireless",
    "description": "Mouse tanpa kabel",
    "price": 150000.0,
    "quantity": 20,
    "created_at": "2026-03-21T10:05:00",
    "updated_at": null
  }
}
```

**Response jika belum ada item:**
```json
{
  "total_items": 0,
  "total_value": 0,
  "most_expensive": null,
  "cheapest": null
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/items/stats \
  -H "Authorization: Bearer <token_kamu>"
```

---

### 8. Tambah Item Baru

Endpoint ini digunakan untuk menambahkan data item baru ke dalam database.

**Method:** POST  
**URL:** `/items`  
**Auth Required:** Ya  

**Request Body:**

| Field | Tipe Data | Wajib | Ketentuan |
|-------|-----------|-------|-----------|
| name | string | Ya | Minimal 1 karakter, maksimal 100 karakter |
| description | string | Tidak | Boleh dikosongkan |
| price | float | Ya | Harus bernilai lebih dari 0 |
| quantity | integer | Tidak | Minimal 0, nilai default adalah 0 |

Contoh request body:
```json
{
  "name": "Laptop",
  "description": "Lenovo",
  "price": 12000000,
  "quantity": 5
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Lenovo",
  "price": 12000000.0,
  "quantity": 5,
  "created_at": "2026-03-21T10:00:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/items \
  -H "Authorization: Bearer <token_kamu>" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Laptop ASUS\", \"description\": \"Laptop untuk kuliah\", \"price\": 8500000, \"quantity\": 5}"
```

---

### 9. Update Item

Endpoint ini digunakan untuk mengubah data item yang sudah ada. Tidak semua field harus dikirim, cukup kirim field yang ingin diubah saja.

**Method:** PUT  
**URL:** `/items/{item_id}` — ganti `{item_id}` dengan angka ID item, contoh: `/items/1`  
**Auth Required:** Ya  

**Request Body (semua field bersifat opsional):**

| Field | Tipe Data | Wajib | Ketentuan |
|-------|-----------|-------|-----------|
| name | string | Tidak | Minimal 1 karakter, maksimal 100 karakter |
| description | string | Tidak | — |
| price | float | Tidak | Harus bernilai lebih dari 0 |
| quantity | integer | Tidak | Minimal 0 |

Contoh request body (hanya mengubah harga dan stok):
```json
{
  "price": 9000000,
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Lenovo",
  "price": 9000000.0,
  "quantity": 3,
  "created_at": "2026-03-21T10:00:00",
  "updated_at": "2026-03-21T11:30:00"
}
```

**Response Gagal — ID tidak ditemukan (404 Not Found):**
```json
{
  "detail": "Item 1 tidak ditemukan"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/items/1 \
  -H "Authorization: Bearer <token_kamu>" \
  -H "Content-Type: application/json" \
  -d "{\"price\": 9000000, \"quantity\": 3}"
```

---

### 10. Hapus Item

Endpoint ini digunakan untuk menghapus item secara permanen dari database. Tindakan ini tidak dapat dibatalkan.

**Method:** DELETE  
**URL:** `/items/{item_id}` — ganti `{item_id}` dengan angka ID item, contoh: `/items/1`  
**Auth Required:** Ya  

**Request Body:** Tidak ada  

**Response Berhasil (204 No Content):**  
Tidak ada data yang dikembalikan. Status 204 menandakan penghapusan berhasil.

**Response Gagal — ID tidak ditemukan (404 Not Found):**
```json
{
  "detail": "Item 1 tidak ditemukan"
}
```

**Curl Command:**
```bash
curl -X DELETE http://localhost:8000/items/1 \
  -H "Authorization: Bearer <token_kamu>"
```

---

### 11. Team Info

Endpoint ini menampilkan informasi seluruh anggota tim yang mengembangkan aplikasi ini.

**Method:** GET  
**URL:** `/team`  
**Auth Required:** Tidak  

**Request Body:** Tidak ada  

**Response (200 OK):**
```json
{
  "team": "cc-kelompok-kel6",
  "members": [
    {"name": "Nama", "nim": "NIM", "role": "Lead Backend"},
    {"name": "Nama", "nim": "NIM", "role": "Lead Frontend"},
    {"name": "Nama", "nim": "NIM", "role": "Lead DevOps"},
    {"name": "Nama", "nim": "NIM", "role": "Lead QA & Docs"},
    {"name": "Zahwa Hanna", "nim": "10231092", "role": "Lead CI/CD"}
  ]
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/team
```

---

## Daftar Kode Error

Berikut adalah kode-kode error yang mungkin muncul saat menggunakan API ini beserta penjelasannya:

| Kode | Status | Penyebab |
|------|--------|----------|
| 400 | Bad Request | Data yang dikirim tidak valid, contohnya email sudah terdaftar |
| 401 | Unauthorized | Token tidak disertakan, token tidak valid, atau token sudah habis masa berlakunya |
| 403 | Forbidden | Akun dalam kondisi tidak aktif |
| 404 | Not Found | Item dengan ID yang diminta tidak ditemukan di database |
| 422 | Unprocessable Entity | Format data salah atau field yang wajib diisi tidak disertakan |
| 500 | Internal Server Error | Terjadi kesalahan pada sisi server |

---

## Testing via Swagger UI

Selain menggunakan curl, seluruh endpoint pada API ini dapat dicoba langsung melalui Swagger UI yang sudah disediakan oleh FastAPI secara otomatis.

Langkah-langkah penggunaannya:

1. Pastikan backend sudah berjalan dengan perintah `uvicorn main:app --reload --port 8000`
2. Buka browser dan akses `http://localhost:8000/docs`
3. Gunakan endpoint `POST /auth/register` untuk membuat akun terlebih dahulu
4. Gunakan endpoint `POST /auth/login` lalu salin nilai `access_token` dari respons yang muncul
5. Klik tombol **Authorize** di pojok kanan atas, ketik `Bearer` diikuti spasi dan token yang sudah disalin
6. Klik **Authorize** lalu **Close**
7. Seluruh endpoint yang memerlukan autentikasi sudah bisa digunakan