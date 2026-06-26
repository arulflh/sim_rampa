# SIM-RAMPA

**Sistem Informasi Manajemen Relawan dan Mitra Penyaluran Air Bersih**

Source code lengkap (frontend + backend) dibangun 100% sesuai prototype/wireframe dan dokumen SRS SIM-RAMPA.

## Teknologi

- **Frontend:** React + Vite + React Router + Axios + lucide-react
- **Backend:** Node.js + Express + MySQL (mysql2) + JWT + bcrypt

## Struktur Folder

```
sim-rampa/
├── backend/      # API Express + MySQL
├── frontend/     # Aplikasi React (Vite)
└── database/     # File SQL siap impor (sim_rampa.sql)
```

## Database

Tersedia 2 cara membuat database:

**Cara A — Impor file SQL langsung (paling cepat):**
```bash
mysql -u root -p < database/sim_rampa.sql
```
Atau lewat phpMyAdmin: menu **Import** → pilih `database/sim_rampa.sql`.
File ini sudah berisi struktur tabel + data contoh + akun admin sekaligus.

**Cara B — Lewat seed Node.js:**
```bash
cd backend && npm run seed
```

## Halaman (sesuai wireframe)

1. Login Admin
2. Dashboard (4 kartu statistik + kegiatan terbaru)
3. Kelola Data Relawan (tambah/edit/hapus/cari + pagination)
4. Kelola Data Mitra (tambah/edit/hapus/cari)
5. Data Kegiatan Penyaluran (tambah/edit/hapus/cari)
6. Form Tambah Kegiatan
7. Laporan Penyaluran (filter tanggal + total + Export Excel)
8. Profil Pengguna (Pengaturan)

---

## Cara Menjalankan

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env          # sesuaikan kredensial MySQL
npm run seed                  # buat database + tabel + data contoh (sesuai wireframe)
npm run dev                   # jalan di http://localhost:5000
```

> `npm run seed` otomatis membuat database `sim_rampa`, seluruh tabel (sesuai SRS Bagian 8),
> serta mengisi data contoh yang persis dengan wireframe (Andi Saputra, Yayasan Sejahtera, dll).

**Akun login default:**
- Email: `admin@simrampa.id`
- Password: `admin123`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                   # jalan di http://localhost:5173
```

Frontend sudah diproxy ke backend (`/api` → `http://localhost:5000`).
Buka `http://localhost:5173` di browser, lalu login.

---

## Database (sesuai SRS Bagian 8)

- `users` (id, name, email, password, role, created_at, updated_at)
- `relawan` (id, nama_relawan, no_hp, email, alamat, ...)
- `mitra` (id, nama_mitra, kontak, alamat, ...)
- `penyaluran_air` (id, tanggal, lokasi, jumlah_air, relawan_id, mitra_id, catatan, ...)

## Keamanan (sesuai NFR)

- Autentikasi JWT (NFR-004)
- Password di-hash dengan bcrypt (NFR-005)

## Endpoint API

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/auth/login` | Login admin |
| GET | `/api/auth/profile` | Profil pengguna |
| GET | `/api/dashboard` | Statistik dashboard |
| GET/POST | `/api/relawan` | List / tambah relawan |
| PUT/DELETE | `/api/relawan/:id` | Edit / hapus relawan |
| GET/POST | `/api/mitra` | List / tambah mitra |
| PUT/DELETE | `/api/mitra/:id` | Edit / hapus mitra |
| GET/POST | `/api/penyaluran` | List / tambah penyaluran |
| PUT/DELETE | `/api/penyaluran/:id` | Edit / hapus penyaluran |
| GET | `/api/penyaluran/laporan` | Laporan + filter tanggal |
