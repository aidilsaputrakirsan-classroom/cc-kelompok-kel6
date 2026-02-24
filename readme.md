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
