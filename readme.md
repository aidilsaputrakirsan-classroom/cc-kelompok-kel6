# ☁️ Cloud App - [Nama Proyek Tim Anda]

Deskripsi singkat aplikasi (1-2 paragraf): apa yang dilakukan, 
untuk siapa, masalah apa yang diselesaikan.

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

## 🚀 Getting Started

### Prasyarat
- Python 3.10+
- Node.js 18+
- Git

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
