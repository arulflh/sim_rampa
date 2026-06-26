import { useEffect, useState } from "react";
import { Users, Handshake, CalendarDays, Droplets } from "lucide-react";
import api from "../services/api.js";

const cards = [
  { key: "totalRelawan", label: "Total Relawan", icon: Users, bg: "#dcfce7", color: "#16a34a", suffix: "" },
  { key: "totalMitra", label: "Total Mitra", icon: Handshake, bg: "#ffedd5", color: "#ea580c", suffix: "" },
  { key: "kegiatanBulanIni", label: "Kegiatan Bulan Ini", icon: CalendarDays, bg: "#f3e8ff", color: "#9333ea", suffix: "" },
  { key: "totalAir", label: "Total Air Disalurkan", icon: Droplets, bg: "#dbeafe", color: "#2563eb", suffix: " L" },
];

export default function Dashboard() {
  const [data, setData] = useState({
    totalRelawan: 0,
    totalMitra: 0,
    kegiatanBulanIni: 0,
    totalAir: 0,
    kegiatanTerbaru: [],
  });

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data)).catch(() => {});
  }, []);

  const fmt = (n) => Number(n).toLocaleString("id-ID");
  const fmtTanggal = (t) =>
    new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="welcome">
        <h2>Selamat datang, Admin</h2>
        <p>Berikut informasi kegiatan penyaluran air bersih.</p>
      </div>

      <div className="stat-grid">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div className="stat-card" key={c.key}>
              <div className="stat-icon" style={{ background: c.bg }}>
                <Icon size={22} color={c.color} />
              </div>
              <div className="stat-info">
                <div className="value">
                  {fmt(data[c.key])}
                  {c.suffix}
                </div>
                <div className="label">{c.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-head">Kegiatan Terbaru</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Mitra</th>
                <th>Jumlah Air</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.kegiatanTerbaru.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty">Belum ada kegiatan.</td>
                </tr>
              ) : (
                data.kegiatanTerbaru.map((k) => (
                  <tr key={k.id}>
                    <td>{fmtTanggal(k.tanggal)}</td>
                    <td>{k.lokasi}</td>
                    <td>{k.nama_mitra || "-"}</td>
                    <td>{fmt(k.jumlah_air)} L</td>
                    <td>
                      <button className="btn-link">Lihat</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
