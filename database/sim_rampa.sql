-- ==========================================================
-- SIM-RAMPA - Database Lengkap (Struktur + Data Contoh)
-- Sistem Informasi Manajemen Relawan dan Mitra Penyaluran Air
-- Struktur tabel sesuai SRS Bagian 8
-- Data contoh sesuai wireframe / prototype
--
-- Cara impor:
--   mysql -u root -p < sim_rampa.sql
-- atau via phpMyAdmin: Import -> pilih file ini
--
-- Akun login default:
--   Email    : admin@simrampa.id
--   Password : admin123
-- ==========================================================

CREATE DATABASE IF NOT EXISTS sim_rampa
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE sim_rampa;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS penyaluran_air;
DROP TABLE IF EXISTS relawan;
DROP TABLE IF EXISTS mitra;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 8.1 Tabel User
-- ----------------------------------------------------------
CREATE TABLE users (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(50)  NOT NULL DEFAULT 'Administrator',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 8.2 Tabel Relawan
-- ----------------------------------------------------------
CREATE TABLE relawan (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama_relawan  VARCHAR(150) NOT NULL,
  no_hp         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150),
  alamat        TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 8.3 Tabel Mitra
-- ----------------------------------------------------------
CREATE TABLE mitra (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama_mitra  VARCHAR(150) NOT NULL,
  kontak      VARCHAR(30)  NOT NULL,
  alamat      TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- 8.4 Tabel Penyaluran Air
-- ----------------------------------------------------------
CREATE TABLE penyaluran_air (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  tanggal     DATE NOT NULL,
  lokasi      VARCHAR(255) NOT NULL,
  jumlah_air  INT NOT NULL,
  relawan_id  BIGINT,
  mitra_id    BIGINT,
  catatan     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_penyaluran_relawan FOREIGN KEY (relawan_id) REFERENCES relawan(id) ON DELETE SET NULL,
  CONSTRAINT fk_penyaluran_mitra   FOREIGN KEY (mitra_id)   REFERENCES mitra(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- DATA CONTOH (sesuai wireframe / prototype)
-- ==========================================================

-- User admin (password: admin123, di-hash dengan bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@simrampa.id', '$2b$10$q7N6FGllyyTq42.pwbY4XOV9n3KJFVlur/hA49hWneLAn7YE6XC2i', 'Administrator');

-- Data Relawan (wireframe halaman 3 - Kelola Data Relawan)
INSERT INTO relawan (nama_relawan, no_hp, email, alamat) VALUES
('Andi Saputra',  '081234567890', 'andi@gmail.com', 'Bogor'),
('Siti Aisyah',   '081298765432', 'siti@email.com', 'Bogor'),
('Rizky Maulana', '081377788899', 'rizky@mail.com', 'Bogor'),
('Dewi Lestari',  '081266655544', 'dewi@mail.com',  'Bogor');

-- Data Mitra (wireframe halaman 4 - Kelola Data Mitra)
INSERT INTO mitra (nama_mitra, kontak, alamat) VALUES
('Yayasan Sejahtera',       '085612345678', 'Bogor'),
('Komunitas Peduli',        '089912345678', 'Bogor'),
('Relawan Nusantara',       '081234987654', 'Jakarta'),
('Solidaritas Air Bersih',  '087812345678', 'Depok');

-- Data Penyaluran Air (wireframe halaman 5 & 7)
INSERT INTO penyaluran_air (tanggal, lokasi, jumlah_air, relawan_id, mitra_id) VALUES
('2024-05-20', 'Kp. Cibodas, Bogor',    20000, 1, 1),
('2024-05-18', 'Desa Sukamaju, Bogor',  15000, 2, 2),
('2024-05-16', 'Kp. Pasir Jaya, Bogor', 10000, 3, 3),
('2024-05-14', 'Kp. Cisarua, Bogor',    25000, 4, 4);

-- ==========================================================
-- Selesai. Total air disalurkan = 70.000 L (sesuai laporan wireframe)
-- ==========================================================
