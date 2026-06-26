-- ==========================================================
-- SIM-RAMPA - Skema Database
-- Sistem Informasi Manajemen Relawan dan Mitra Penyaluran Air
-- Struktur sesuai SRS Bagian 8 (Struktur Database)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS sim_rampa
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE sim_rampa;

-- 8.1 Tabel User
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(50)  NOT NULL DEFAULT 'Administrator',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8.2 Tabel Relawan
CREATE TABLE IF NOT EXISTS relawan (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama_relawan  VARCHAR(150) NOT NULL,
  no_hp         VARCHAR(30)  NOT NULL,
  email         VARCHAR(150),
  alamat        TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8.3 Tabel Mitra
CREATE TABLE IF NOT EXISTS mitra (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama_mitra  VARCHAR(150) NOT NULL,
  kontak      VARCHAR(30)  NOT NULL,
  alamat      TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8.4 Tabel Penyaluran Air
CREATE TABLE IF NOT EXISTS penyaluran_air (
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
);
