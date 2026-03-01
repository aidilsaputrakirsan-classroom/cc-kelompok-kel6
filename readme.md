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

Sebelum menjalankan aplikasi **SIKASI (Sistem Informasi Keuangan dan Administrasi HMSI)**, terdapat beberapa perangkat lunak yang harus terinstal pada komputer. Prasyarat ini diperlukan agar sistem backend dan frontend dapat berjalan dengan baik serta mendukung proses pengembangan dan kolaborasi tim.

### 1. Python 3.10+

Python digunakan sebagai bahasa pemrograman utama pada sisi **backend**. Aplikasi ini dibangun menggunakan framework **FastAPI**, yang berjalan di atas Python. Seluruh logika bisnis seperti pencatatan pemasukan, pengeluaran, setoran, pengelolaan surat, hingga integrasi dengan database dijalankan melalui backend berbasis Python.

Versi minimal **Python 3.10+** diperlukan karena:
- Mendukung fitur modern seperti type hints yang lebih optimal.
- Kompatibel dengan library terbaru yang digunakan dalam proyek.
- Memberikan performa dan keamanan yang lebih baik dibandingkan versi lama.

Tanpa Python, backend tidak dapat dijalankan sehingga sistem tidak dapat memproses data keuangan maupun administrasi.

---

### 2. Node.js 18+

Node.js digunakan untuk menjalankan **frontend** yang dibangun menggunakan **React** dan Vite. Node.js berfungsi untuk:
- Mengelola dependency melalui `npm`
- Menjalankan server development frontend
- Melakukan proses build aplikasi

Versi **Node.js 18+** direkomendasikan karena:
- Mendukung versi terbaru React dan Vite.
- Lebih stabil dan memiliki dukungan jangka panjang (LTS).
- Menghindari error dependency yang sering terjadi pada versi lama.

Tanpa Node.js, tampilan antarmuka (UI) aplikasi tidak dapat dijalankan sehingga pengguna tidak dapat mengakses sistem melalui browser.

---

### 3. Git

Git digunakan sebagai sistem **version control** untuk mendukung kolaborasi tim dalam pengembangan aplikasi. Melalui Git, setiap anggota tim dapat:
- Melakukan commit perubahan kode
- Mengelola riwayat pengembangan proyek
- Menghindari konflik saat bekerja secara bersamaan
- Mengirim dan mengambil pembaruan dari GitHub Classroom

Git sangat penting dalam proyek ini karena sistem dikembangkan secara tim dan harus dipush ke repository GitHub sebagai bagian dari penilaian.

Tanpa Git, proses kolaborasi dan pengumpulan tugas tidak dapat dilakukan dengan baik.

---

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
