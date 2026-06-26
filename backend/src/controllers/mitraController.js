import pool from "../config/db.js";

// FR-009 / FR-017 Lihat & cari mitra
export async function getAll(req, res) {
  try {
    const { q } = req.query;
    let sql = "SELECT * FROM mitra";
    const params = [];
    if (q) {
      sql += " WHERE nama_mitra LIKE ?";
      params.push(`%${q}%`);
    }
    sql += " ORDER BY id ASC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data mitra." });
  }
}

export async function getOne(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM mitra WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Mitra tidak ditemukan." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data mitra." });
  }
}

// FR-008 Tambah mitra
export async function create(req, res) {
  try {
    const { nama_mitra, kontak, alamat } = req.body;
    if (!nama_mitra || !kontak) {
      return res.status(400).json({ message: "Nama lembaga dan kontak wajib diisi." });
    }
    const [result] = await pool.query(
      "INSERT INTO mitra (nama_mitra, kontak, alamat) VALUES (?, ?, ?)",
      [nama_mitra, kontak, alamat || null]
    );
    const [rows] = await pool.query("SELECT * FROM mitra WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambah data mitra." });
  }
}

// FR-010 Edit mitra
export async function update(req, res) {
  try {
    const { nama_mitra, kontak, alamat } = req.body;
    const [result] = await pool.query(
      "UPDATE mitra SET nama_mitra = ?, kontak = ?, alamat = ? WHERE id = ?",
      [nama_mitra, kontak, alamat || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Mitra tidak ditemukan." });
    const [rows] = await pool.query("SELECT * FROM mitra WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui data mitra." });
  }
}

// FR-011 Hapus mitra
export async function remove(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM mitra WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Mitra tidak ditemukan." });
    res.json({ message: "Data mitra berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus data mitra." });
  }
}
