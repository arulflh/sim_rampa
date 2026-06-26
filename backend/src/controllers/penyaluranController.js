import pool from "../config/db.js";

const SELECT_JOIN = `
  SELECT p.*, r.nama_relawan, m.nama_mitra
  FROM penyaluran_air p
  LEFT JOIN relawan r ON p.relawan_id = r.id
  LEFT JOIN mitra m   ON p.mitra_id   = m.id
`;

// FR-013 Lihat riwayat penyaluran
export async function getAll(req, res) {
  try {
    const { q } = req.query;
    let sql = SELECT_JOIN;
    const params = [];
    if (q) {
      sql += " WHERE p.lokasi LIKE ? OR m.nama_mitra LIKE ?";
      params.push(`%${q}%`, `%${q}%`);
    }
    sql += " ORDER BY p.tanggal DESC, p.id DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data penyaluran." });
  }
}

export async function getOne(req, res) {
  try {
    const [rows] = await pool.query(SELECT_JOIN + " WHERE p.id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data penyaluran." });
  }
}

// FR-012 Catat penyaluran air
export async function create(req, res) {
  try {
    const { tanggal, lokasi, jumlah_air, relawan_id, mitra_id, catatan } = req.body;
    if (!tanggal || !lokasi || !jumlah_air) {
      return res.status(400).json({ message: "Tanggal, lokasi, dan jumlah air wajib diisi." });
    }
    const [result] = await pool.query(
      "INSERT INTO penyaluran_air (tanggal, lokasi, jumlah_air, relawan_id, mitra_id, catatan) VALUES (?, ?, ?, ?, ?, ?)",
      [tanggal, lokasi, jumlah_air, relawan_id || null, mitra_id || null, catatan || null]
    );
    const [rows] = await pool.query(SELECT_JOIN + " WHERE p.id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mencatat penyaluran." });
  }
}

export async function update(req, res) {
  try {
    const { tanggal, lokasi, jumlah_air, relawan_id, mitra_id, catatan } = req.body;
    const [result] = await pool.query(
      "UPDATE penyaluran_air SET tanggal=?, lokasi=?, jumlah_air=?, relawan_id=?, mitra_id=?, catatan=? WHERE id=?",
      [tanggal, lokasi, jumlah_air, relawan_id || null, mitra_id || null, catatan || null, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan." });
    const [rows] = await pool.query(SELECT_JOIN + " WHERE p.id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui penyaluran." });
  }
}

export async function remove(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM penyaluran_air WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan." });
    res.json({ message: "Data penyaluran berhasil dihapus." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus penyaluran." });
  }
}

// FR-014 Laporan dengan filter tanggal
export async function laporan(req, res) {
  try {
    const { dari, sampai } = req.query;
    let sql = SELECT_JOIN;
    const params = [];
    const where = [];
    if (dari) { where.push("p.tanggal >= ?"); params.push(dari); }
    if (sampai) { where.push("p.tanggal <= ?"); params.push(sampai); }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY p.tanggal DESC, p.id DESC";
    const [rows] = await pool.query(sql, params);
    const total = rows.reduce((sum, r) => sum + Number(r.jumlah_air || 0), 0);
    res.json({ data: rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil laporan." });
  }
}
