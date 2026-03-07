# Database Schema

## Table: items

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