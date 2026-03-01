# ☁️ Cloud App - SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI)

Sistem ini adalah sistem yang dirancang untuk membantu para pengurus Himpunan Mahasiswa Sistem Informasi (HMSI) dalam mengelola keuangan dan administrasi organisasi secara terintegrasi dalam satu platform. Melalui sistem ini, bendahara dapat mencatat dana masuk dan dana keluar sehingga arus kas (cash flow) dapat terpantau dan terupdate secara otomatis. Selain itu, sistem juga menyediakan fitur pengelolaan surat masuk dan surat keluar, termasuk penomoran surat serta pengelolaan tanda tangan dari Ketua Himpunan Sistem Informasi (HMSI) secara digital. Dengan demikian, seluruh data keuangan dan administrasi dapat tersimpan dengan rapi dan terstruktur.

Aplikasi ini ditujukan bagi seluruh pengurus HMSI untuk mendukung transparansi, ketertiban, dan efisiensi dalam pengelolaan organisasi. Sistem ini hadir sebagai solusi atas permasalahan pencatatan manual yang sering tidak terorganisir, sulit direkap, dan kurang transparan. Dengan adanya sistem yang terintegrasi, proses pelaporan dan administrasi menjadi lebih akurat, praktis, dan mudah diakses ketika dibutuhkan.

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Achmad Bayhaqi | 10231001 | Lead Backend |
| Indah Nur Fortuna | 10231044 | Lead Frontend |
| Alfiani Dwiyuniarti | 10231010 | Lead DevOps |
| Zahwa Hanna Dwi Putri | 10231092 | Lead CI/CD & Deploy |
| Nilam Ayu NandaStari Romdoni | 10231070 | Lead QA & Docs |

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| FastAPI   | Backend REST API |
| React     | Frontend SPA |
| PostgreSQL | Database |
| Docker    | Containerization |
| GitHub Actions | CI/CD |
| Railway/Render | Cloud Deployment |

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


# Back-end Setup

bikin folder `venv/:

```
python -m venv venv
```

Aktivasi tergantung OS:

Mac / Linux:

```
source venv/bin/activate
```

Windows (PowerShell):

```
venv\Scripts\Activate
```

Kalau sudah aktif, di terminal biasanya ada `(venv)` di depan.
Kalau nggak ada, berarti belum aktif. Jangan install global.

---

INSTALL DEPENDENCY

Pastikan punya `requirements.txt` berisi:

```
fastapi==0.115.0
uvicorn==0.30.0
.....
```

Lalu install:

```
pip install -r requirements.txt
```

Kalau error “pip not found”, berarti Python kamu nggak ke PATH dengan benar.

---

JALANKAN SERVER BACKEND

di folder backend:

```
uvicorn main:app --reload --port 8000
```

# Front-end Setup
