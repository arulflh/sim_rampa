import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  // Buat koneksi tanpa database dulu agar bisa membuat database
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  const schema = fs.readFileSync(path.join(__dirname, "config", "schema.sql"), "utf8");
  await conn.query(schema);
  await conn.query(`USE ${process.env.DB_NAME || "sim_rampa"}`);

  // Kosongkan tabel agar seed bisa diulang
  await conn.query("SET FOREIGN_KEY_CHECKS = 0");
  await conn.query("TRUNCATE TABLE penyaluran_air");
  await conn.query("TRUNCATE TABLE relawan");
  await conn.query("TRUNCATE TABLE mitra");
  await conn.query("TRUNCATE TABLE users");
  await conn.query("SET FOREIGN_KEY_CHECKS = 1");

  // User admin (sesuai profil di wireframe: admin@simrampa.id)
  const hash = await bcrypt.hash("admin123", 10);
  await conn.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin", "admin@simrampa.id", hash, "Administrator"]
  );

  // Data relawan (persis wireframe halaman 3)
  await conn.query(
    `INSERT INTO relawan (nama_relawan, no_hp, email, alamat) VALUES
     ('Andi Saputra', '081234567890', 'andi@gmail.com', 'Bogor'),
     ('Siti Aisyah', '081298765432', 'siti@email.com', 'Bogor'),
     ('Rizky Maulana', '081377788899', 'rizky@mail.com', 'Bogor'),
     ('Dewi Lestari', '081266655544', 'dewi@mail.com', 'Bogor')`
  );

  // Data mitra (persis wireframe halaman 4)
  await conn.query(
    `INSERT INTO mitra (nama_mitra, kontak, alamat) VALUES
     ('Yayasan Sejahtera', '085612345678', 'Bogor'),
     ('Komunitas Peduli', '089912345678', 'Bogor'),
     ('Relawan Nusantara', '081234987654', 'Jakarta'),
     ('Solidaritas Air Bersih', '087812345678', 'Depok')`
  );

  // Data penyaluran air (persis wireframe halaman 5 & 7)
  await conn.query(
    `INSERT INTO penyaluran_air (tanggal, lokasi, jumlah_air, relawan_id, mitra_id) VALUES
     ('2024-05-20', 'Kp. Cibodas, Bogor', 20000, 1, 1),
     ('2024-05-18', 'Desa Sukamaju, Bogor', 15000, 2, 2),
     ('2024-05-16', 'Kp. Pasir Jaya, Bogor', 10000, 3, 3),
     ('2024-05-14', 'Kp. Cisarua, Bogor', 25000, 4, 4)`
  );

  console.log("Seed berhasil. Login: admin@simrampa.id / admin123");
  await conn.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
