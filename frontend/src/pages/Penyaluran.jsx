import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";

const EMPTY = { tanggal: "", lokasi: "", mitra_id: "", relawan_id: "", jumlah_air: "", catatan: "" };

export default function Penyaluran() {
  const [list, setList] = useState([]);
  const [relawanOpt, setRelawanOpt] = useState([]);
  const [mitraOpt, setMitraOpt] = useState([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = (search = "") => {
    api.get("/penyaluran", { params: search ? { q: search } : {} })
      .then((res) => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    api.get("/relawan").then((r) => setRelawanOpt(r.data)).catch(() => {});
    api.get("/mitra").then((r) => setMitraOpt(r.data)).catch(() => {});
  }, []);

  const onSearch = (val) => { setQ(val); load(val); };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (p) => {
    setForm({
      tanggal: p.tanggal,
      lokasi: p.lokasi,
      mitra_id: p.mitra_id || "",
      relawan_id: p.relawan_id || "",
      jumlah_air: p.jumlah_air,
      catatan: p.catatan || "",
    });
    setEditId(p.id);
    setModal(true);
  };

  const save = async () => {
    if (!form.tanggal || !form.lokasi || !form.jumlah_air) return;
    const payload = {
      ...form,
      mitra_id: form.mitra_id || null,
      relawan_id: form.relawan_id || null,
      jumlah_air: Number(form.jumlah_air),
    };
    if (editId) await api.put(`/penyaluran/${editId}`, payload);
    else await api.post("/penyaluran", payload);
    setModal(false);
    load(q);
  };

  const del = async (id) => {
    if (!confirm("Hapus data kegiatan ini?")) return;
    await api.delete(`/penyaluran/${id}`);
    load(q);
  };

  const fmt = (n) => Number(n).toLocaleString("id-ID");
  const fmtTanggal = (t) =>
    new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <div className="toolbar">
        <h2 className="page-title">Data Kegiatan Penyaluran</h2>
        <button className="btn-add" onClick={openAdd}>
          <Plus size={16} /> Tambah Kegiatan
        </button>
      </div>

      <div className="card">
        <div style={{ padding: "16px 18px 0" }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input placeholder="Cari kegiatan..." value={q} onChange={(e) => onSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 50 }}>No</th>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Mitra</th>
                <th>Jumlah Air</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={6} className="empty">Tidak ada data kegiatan.</td></tr>
              ) : (
                list.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{fmtTanggal(p.tanggal)}</td>
                    <td>{p.lokasi}</td>
                    <td>{p.nama_mitra || "-"}</td>
                    <td>{fmt(p.jumlah_air)} L</td>
                    <td>
                      <button className="icon-btn edit" onClick={() => openEdit(p)}><Pencil size={16} /></button>
                      <button className="icon-btn delete" onClick={() => del(p.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={editId ? "Edit Kegiatan Penyaluran" : "Tambah Kegiatan Penyaluran"} onClose={() => setModal(false)}>
          <div className="form-row">
            <label>Tanggal</label>
            <div className="field">
              <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <label>Lokasi</label>
            <div className="field">
              <input value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} placeholder="Masukkan lokasi" />
            </div>
          </div>
          <div className="form-row">
            <label>Mitra</label>
            <div className="field">
              <select value={form.mitra_id} onChange={(e) => setForm({ ...form, mitra_id: e.target.value })}>
                <option value="">Pilih mitra</option>
                {mitraOpt.map((m) => <option key={m.id} value={m.id}>{m.nama_mitra}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Relawan</label>
            <div className="field">
              <select value={form.relawan_id} onChange={(e) => setForm({ ...form, relawan_id: e.target.value })}>
                <option value="">Pilih relawan</option>
                {relawanOpt.map((r) => <option key={r.id} value={r.id}>{r.nama_relawan}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Jumlah Air (Liter)</label>
            <div className="field">
              <input type="number" value={form.jumlah_air} onChange={(e) => setForm({ ...form, jumlah_air: e.target.value })} placeholder="Masukkan jumlah air" />
            </div>
          </div>
          <div className="form-row">
            <label>Catatan</label>
            <div className="field">
              <textarea rows={3} value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Masukkan catatan (opsional)" />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setModal(false)}>Batal</button>
            <button className="btn-save" onClick={save}>Simpan</button>
          </div>
        </Modal>
      )}
    </>
  );
}
