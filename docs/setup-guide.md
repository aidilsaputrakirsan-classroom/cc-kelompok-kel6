Dokumen ini menjelaskan langkah-langkah untuk menjalankan aplikasi SIKASI dari awal hingga aplikasi dapat diakses melalui browser. Aplikasi ini merupakan aplikasi berbasis web yang digunakan untuk mendukung pengelolaan keuangan dan administrasi HMSI, dengan frontend menggunakan React serta backend yang dibangun dalam beberapa service yang saling terintegrasi.

Panduan ini ditujukan agar siapa pun yang baru pertama kali melihat repository ini tetap dapat menjalankan aplikasi tanpa kebingungan.

### 1. Persiapan Environment

Sebelum menjalankan aplikasi, pastikan beberapa software berikut sudah terpasang pada komputer:

- Git untuk mengunduh repository project
- Docker Desktop untuk menjalankan aplikasi dalam container
- Docker Compose untuk menjalankan seluruh service secara bersamaan

Software tersebut diperlukan karena aplikasi SIKASI pada repository ini dijalankan menggunakan beberapa service yang saling terhubung, sehingga proses menjalankannya akan lebih mudah menggunakan Docker.

### 2. Mengunduh Repository Project

Langkah pertama adalah mengunduh repository project dari GitHub ke komputer lokal menggunakan Git.

Masuk ke terminal, lalu jalankan proses clone repository. Setelah repository berhasil diunduh, masuk ke folder project utama.

```
git clone <url-repository>
cd <nama-folder-project>
``` 
Struktur project secara umum akan terlihat seperti berikut:

```
frontend/                    berisi aplikasi React
services/
  auth-service/              berisi service autentikasi dan user
  finance-service/           berisi service keuangan
  letter-service/            berisi service surat
  gateway/                   berisi konfigurasi gateway
docker-compose.example.yml   berisi konfigurasi untuk menjalankan seluruh service
docs/                        berisi dokumentasi project
```
Pemisahan folder ini menunjukkan bahwa SIKASI dibangun dengan struktur beberapa service backend yang dipisahkan berdasarkan fungsi masing-masing.

### 3. Menyiapkan File Environment

Sebelum aplikasi dijalankan, beberapa service memerlukan file konfigurasi environment.

Pada repository ini sudah tersedia file contoh environment untuk masing-masing service. File tersebut perlu disalin dari .env.example menjadi .env.

Contohnya adalah sebagai berikut:
```
cp services/auth-service/.env.example services/auth-service/.env
cp services/finance-service/.env.example services/finance-service/.env
cp services/letter-service/.env.example services/letter-service/.env
```

File environment ini digunakan untuk menyimpan konfigurasi penting seperti koneksi database, secret key, dan pengaturan service lainnya.

Pastikan isi file .env sudah sesuai dengan kebutuhan agar seluruh service dapat saling terhubung dengan benar.

### 4. Menjalankan Aplikasi

Setelah konfigurasi environment selesai, langkah berikutnya adalah menjalankan seluruh service aplikasi.

Repository ini menyediakan file docker-compose.example.yml yang digunakan untuk menjalankan semua komponen aplikasi secara bersamaan.

Jalankan perintah berikut pada terminal:
```
docker compose -f docker-compose.example.yml up --build
```

Perintah tersebut akan membangun dan menjalankan beberapa bagian aplikasi, seperti frontend, service autentikasi, service keuangan, service surat, database, dan gateway.

Jika proses berjalan dengan baik, seluruh container akan aktif dan aplikasi siap diakses melalui browser.

### 5. Akses Aplikasi melalui Browser

Setelah seluruh service berhasil dijalankan, aplikasi dapat diakses melalui browser.

Secara umum, aplikasi akan tersedia pada alamat:
```
http://localhost
```
Frontend SIKASI akan ditampilkan melalui gateway, kemudian gateway akan meneruskan request ke service yang sesuai.

Sebagai contoh, request yang berhubungan dengan autentikasi akan diarahkan ke auth-service, request keuangan akan diarahkan ke finance-service, dan request surat akan diarahkan ke letter-service.

### 6. Fitur yang Dapat Dicoba

Setelah aplikasi berhasil dibuka, beberapa fitur utama yang dapat dicoba antara lain:

login dan registrasi pengguna
melihat dashboard ringkasan keuangan
mengakses modul transaksi keuangan
mengakses modul surat
mengelola data pengguna sesuai role yang dimiliki

Melalui fitur-fitur tersebut, pengguna dapat melihat bahwa SIKASI digunakan untuk membantu proses keuangan dan administrasi organisasi secara terintegrasi.

### 7. Verifikasi Aplikasi Berjalan

Untuk memastikan aplikasi berjalan dengan benar, lakukan beberapa pengecekan berikut:

halaman utama aplikasi dapat dibuka di browser
halaman login tampil dengan baik
proses login atau registrasi dapat dilakukan
menu dashboard dapat diakses
modul keuangan dan surat dapat dibuka tanpa error

Jika semua langkah tersebut berhasil, maka aplikasi SIKASI telah berjalan dengan baik pada environment lokal.

### 8. Menghentikan Aplikasi

Setelah selesai digunakan, seluruh service aplikasi dapat dihentikan dengan perintah berikut:
```
docker compose -f docker-compose.example.yml down
```
Perintah ini akan menghentikan seluruh container yang sebelumnya dijalankan.

Untuk menjalankan aplikasi SIKASI, pengguna perlu menyiapkan environment, mengunduh repository, menyalin file environment, lalu menjalankan seluruh service menggunakan Docker Compose. Setelah itu, aplikasi dapat diakses melalui browser dan digunakan untuk mendukung pengelolaan keuangan serta administrasi organisasi.
Dengan mengikuti langkah-langkah pada panduan ini, siapa pun yang baru pertama kali melihat repository SIKASI tetap dapat menjalankan aplikasi tanpa kebingungan.