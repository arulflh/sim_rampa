import pool from "../config/db.js";

// FR-005 / FR-016 Lihat & cari relawan
export async function getAll(req, res) {
  try {
    const { q } = req.query;
    let sql = "SELECT * FROM relawan";
    const params = [];
    if (q) {
      sql += " WHERE nama_relawan LIKE ?";
      params.push(`%${q}%`);
    }
    sql += " ORDER BY id ASC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data relawan." });
  }
}

export async function getOne(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM relawan WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Relawan tidak ditemukan." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data relawan." });
  }
}

// FR-004 Tambah relawan
export async function create(req, res) {
  try {
    const { nama_relawan, no_hp, email, alamat } = req.body;
    if (!nama_relawan || !no_hp) {
      return res.status(400).json({ message: "Nama dan No. HP wajib diisi." });
    }
    const [result] = await pool.query(
      "INSERT INTO relawan (nama_relawan, no_hp, email, alamat) VALUES (?, ?, ?, ?)",
      [nama_relawan, no_hp, email || null, alamat || null]
    );
    const [rows] = await pool.query("SELECT * FROM relawan WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambah data relawan." });
  }
}

// FR-006 Edit relawan
export async function update(req, res) {
  try {
    const { nama_relawan, no_hp, email, alamat } = req.body;
    const [result] = await pool.query(
      "UPDATE relawan SET nama_relawan = ?, no_hp = ?, email = ?, alamat = ? WHERE id = ?",
      [nama_relawan, no_hp, email || null, alamat || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Relawan tidak ditemukan." });
    const [rows] = await pool.query("SELECT * FROM relawan WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui data relawan." });
  }
}

// FR-007 Hapus relawan
export async function remove(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM relawan WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Relawan tidak ditemukan." });
    res.json({ message: "Data relawan berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus data relawan." });
  }
}
