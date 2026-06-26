import pool from "../config/db.js";

// FR-003 Lihat dashboard (kartu statistik + kegiatan terbaru)
export async function getDashboard(req, res) {
  try {
    const [[{ totalRelawan }]] = await pool.query("SELECT COUNT(*) AS totalRelawan FROM relawan");
    const [[{ totalMitra }]] = await pool.query("SELECT COUNT(*) AS totalMitra FROM mitra");
    const [[{ kegiatanBulanIni }]] = await pool.query(
      "SELECT COUNT(*) AS kegiatanBulanIni FROM penyaluran_air WHERE MONTH(tanggal)=MONTH(CURDATE()) AND YEAR(tanggal)=YEAR(CURDATE())"
    );
    const [[{ totalAir }]] = await pool.query(
      "SELECT COALESCE(SUM(jumlah_air),0) AS totalAir FROM penyaluran_air"
    );

    const [terbaru] = await pool.query(`
      SELECT p.id, p.tanggal, p.lokasi, p.jumlah_air, m.nama_mitra
      FROM penyaluran_air p
      LEFT JOIN mitra m ON p.mitra_id = m.id
      ORDER BY p.tanggal DESC, p.id DESC
      LIMIT 5
    `);

    res.json({
      totalRelawan,
      totalMitra,
      kegiatanBulanIni,
      totalAir,
      kegiatanTerbaru: terbaru,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data dashboard." });
  }
}
