# ============================================================
# Stage: Production Image
# ============================================================

# 1. Base image — Python 3.12 slim (debian minimal, ~50MB)
FROM python:3.12-slim

# 2. Set working directory di dalam container
WORKDIR /app

# 3. Copy HANYA requirements.txt dulu (cache optimization)
# Layer ini hanya rebuild jika requirements.txt berubah

COPY requirements.txt .

# 4. Install Python dependencies
# --no-cache-dir: jangan simpan pip cache (hemat space)
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy seluruh kode aplikasi
# Layer ini rebuild setiap kali kode berubah
COPY . .

# 5.1 Copy startup script untuk menunggu database siap
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# 6. Dokumentasikan port yang digunakan
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --retries=3
CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# 7. Command untuk menjalankan aplikasi

# --host 0.0.0.0: agar bisa diakses dari luar containers
# aplikasi hanya start setelah database siap

CMD ["/wait-for-db.sh", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
