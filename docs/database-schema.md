# Database Schema

## Table: items 

Tabel items digunakan untuk menyimpan seluruh data barang atau item yang terdapat pada sistem inventory. Tabel ini menjadi pusat penyimpanan informasi item, mulai dari identitas item, nama, deskripsi, harga, jumlah stok, hingga waktu pembuatan dan pembaruan data. Dengan adanya tabel ini, sistem dapat mengelola data inventory secara terstruktur, seperti menambahkan item baru, menampilkan daftar item, memperbarui informasi item, menghapus item, serta menghitung statistik inventory.

| Kolom | Tipe | Penjelasan |
|------|------|------|
| id | Integer | Primary key, auto increment |
| name | String(100) | Nama item |
| description | Text | Deskripsi item |
| price | Float | Harga item |
| quantity | Integer | Jumlah stok item |
| created_at | DateTime | Waktu item dibuat kapan |
| updated_at | DateTime | Waktu item terakhir diupdate |

---

## Penjelasan Kolom
-  id = Primary key dari tabel items. Nilai dibuat otomatis (auto increment).

- name = Nama item. Tipe data String maksimalnya 100 karakter.

- description = Deskripsi tambahan buat item.

- price = Harga item dalam bentuk angka (float).

- quantity = Jumlah stok item yang tersedia.

- created_at = Waktu saat data item pertama kali dibuat.

- updated_at = Waktu terakhir data item diperbarui.