import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import api from "../services/api.js";

export default function Laporan() {
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const load = () => {
    const params = {};
    if (dari) params.dari = dari;
    if (sampai) params.sampai = sampai;
    api.get("/penyaluran/laporan", { params })
      .then((res) => { setRows(res.data.data); setTotal(res.data.total); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const fmt = (n) => Number(n).toLocaleString("id-ID");
  const fmtTanggal = (t) =>
    new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  // FR-015 Export laporan ke CSV (dapat dibuka di Excel)
  const exportExcel = () => {
    const header = ["Tanggal", "Lokasi", "Mitra", "Jumlah Air (L)"];
    const lines = rows.map((r) => [
      fmtTanggal(r.tanggal),
      r.lokasi,
      r.nama_mitra || "-",
      r.jumlah_air,
    ]);
    lines.push(["Total", "", "", total]);
    const csv = [header, ...lines]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_penyaluran_air.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="toolbar">
        <h2 className="page-title">Laporan Penyaluran</h2>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="filter-bar">
          <div className="filter-field">
            <label>Dari Tanggal</label>
            <input type="date" value={dari} onChange={(e) => setDari(e.target.value)} />
          </div>
          <div className="filter-field">
            <label>Sampai Tanggal</label>
            <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} />
          </div>
          <button className="btn-filter" onClick={load}>Filter</button>
          <button className="btn-export" onClick={exportExcel}>
            <FileDown size={16} /> Export Excel
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Mitra</th>
                <th>Jumlah Air</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={4} className="empty">Tidak ada data pada periode ini.</td></tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtTanggal(r.tanggal)}</td>
                    <td>{r.lokasi}</td>
                    <td>{r.nama_mitra || "-"}</td>
                    <td>{fmt(r.jumlah_air)} L</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total</td>
                <td>{fmt(total)} L</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
