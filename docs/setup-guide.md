Dokumen ini menjelaskan langkah-langkah untuk menjalankan aplikasi Cloud App dari awal hingga aplikasi dapat diakses melalui browser. Aplikasi ini merupakan aplikasi full-stack yang terdiri dari backend menggunakan FastAPI dan PostgreSQL serta frontend menggunakan React.

Panduan ini ditujukan agar siapa pun yang baru pertama kali melihat repository ini tetap dapat menjalankan aplikasi tanpa kebingungan.

### 1. Persiapan Environment

Sebelum menjalankan aplikasi, pastikan beberapa software berikut sudah terinstall pada komputer:

Git untuk mengunduh repository
Python 3.10 atau lebih baru untuk menjalankan backend
Node.js dan npm untuk menjalankan frontend React
PostgreSQL sebagai database aplikasi

Semua software tersebut digunakan karena backend aplikasi dibangun dengan Python dan FastAPI, sementara frontend menggunakan React yang berjalan melalui Node.js.

### 2. Mengunduh Repository Project

Langkah pertama adalah mengunduh repository project dari GitHub ke komputer lokal menggunakan Git.

Masuk ke terminal lalu jalankan proses clone repository. Setelah repository berhasil diunduh, masuk ke folder project utama.

Struktur project secara umum akan terlihat seperti berikut:

```backend/ berisi kode API FastAPI
frontend/ berisi aplikasi React
docs/ berisi dokumentasi project
README.md berisi informasi umum repository
```

Pemisahan folder ini mengikuti konsep client-server architecture, di mana frontend dan backend dikembangkan secara terpisah.

### 3. Menyiapkan Database PostgreSQL

Aplikasi ini menggunakan PostgreSQL sebagai database untuk menyimpan data.

Setelah PostgreSQL terinstall, buat sebuah database baru yang akan digunakan oleh aplikasi. Database ini nantinya akan dihubungkan dengan backend menggunakan SQLAlchemy.

Pastikan PostgreSQL sedang berjalan di komputer dan pengguna mengetahui username serta password yang digunakan saat instalasi.

Database yang telah dibuat akan digunakan oleh backend untuk menyimpan data seperti item yang dibuat melalui API.

### 4. Menjalankan Backend API

Setelah database siap, langkah berikutnya adalah menjalankan backend.

Masuk ke folder backend di dalam project. Backend ini dibangun menggunakan FastAPI, sebuah framework Python untuk membuat REST API.

Sebelum menjalankan aplikasi, install terlebih dahulu seluruh dependency Python yang diperlukan oleh project. Dependency tersebut sudah tercantum dalam file requirements.txt.

Backend kemudian dijalankan menggunakan Uvicorn, yaitu ASGI server yang digunakan untuk menjalankan aplikasi FastAPI.

```
Jika backend berhasil dijalankan, maka API akan tersedia pada alamat http://localhost:8000
FastAPI juga secara otomatis menyediakan dokumentasi API berbasis Swagger UI yang dapat diakses melalui http://localhost:8000/docs
```

Melalui halaman ini, semua endpoint API dapat diuji secara langsung dari browser.

### 5. Menjalankan Frontend React

Setelah backend berhasil berjalan, langkah berikutnya adalah menjalankan frontend.

Frontend project ini dibangun menggunakan React dengan tooling Vite. React digunakan untuk membangun antarmuka pengguna yang dapat berkomunikasi dengan backend melalui HTTP request.

Masuk ke folder frontend lalu install seluruh dependency JavaScript yang dibutuhkan oleh project menggunakan npm.

Setelah proses instalasi selesai, jalankan development server React.
```
Server development React biasanya akan berjalan pada alamat http://localhost:5173
```

Frontend ini akan melakukan request ke backend API yang berjalan pada port 8000 untuk mengambil dan memanipulasi data.

### 6. Integrasi Frontend dan Backend

Setelah kedua server berjalan, aplikasi full-stack dapat diakses melalui browser.

Frontend React akan mengirim request ke backend FastAPI untuk melakukan operasi seperti mengambil data, menambah data, memperbarui data, atau menghapus data.

Backend kemudian akan memproses request tersebut dan berinteraksi dengan database PostgreSQL untuk membaca atau menyimpan data.

Hasil dari proses tersebut akan dikirim kembali ke frontend dalam bentuk response JSON, kemudian ditampilkan pada antarmuka pengguna.

Dengan demikian, alur kerja aplikasi menjadi:
```
User melakukan aksi pada frontend
Frontend mengirim request ke backend API
Backend memproses request dan mengakses database
Backend mengirim response ke frontend
Frontend menampilkan hasil ke user
```

### 7. Verifikasi Aplikasi Berjalan

Untuk memastikan aplikasi berjalan dengan benar, lakukan beberapa pengecekan berikut:
```
Backend API dapat diakses di http://localhost:8000
Dokumentasi API Swagger muncul di http://localhost:8000/docs
Frontend React dapat dibuka di http://localhost:5173
Frontend dapat mengambil data dari backend tanpa error
```
Jika semua langkah tersebut berhasil, maka aplikasi full-stack telah berjalan dengan sukses.

### 8. Ringkasan

Untuk menjalankan aplikasi secara keseluruhan, backend dan frontend harus berjalan secara bersamaan pada dua terminal berbeda.
Backend bertugas menyediakan API dan mengelola koneksi ke database PostgreSQL, sedangkan frontend bertugas menampilkan antarmuka pengguna dan berkomunikasi dengan backend melalui HTTP request. Dengan mengikuti langkah-langkah pada panduan ini, aplikasi Cloud App dapat dijalankan dari awal hingga siap digunakan oleh pengguna.