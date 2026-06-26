import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";

const EMPTY = { nama_mitra: "", kontak: "", alamat: "" };

export default function Mitra() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = (search = "") => {
    api.get("/mitra", { params: search ? { q: search } : {} })
      .then((res) => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const onSearch = (val) => { setQ(val); load(val); };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (m) => {
    setForm({ nama_mitra: m.nama_mitra, kontak: m.kontak, alamat: m.alamat || "" });
    setEditId(m.id);
    setModal(true);
  };

  const save = async () => {
    if (!form.nama_mitra || !form.kontak) return;
    if (editId) await api.put(`/mitra/${editId}`, form);
    else await api.post("/mitra", form);
    setModal(false);
    load(q);
  };

  const del = async (id) => {
    if (!confirm("Hapus data mitra ini?")) return;
    await api.delete(`/mitra/${id}`);
    load(q);
  };

  return (
    <>
      <div className="toolbar">
        <h2 className="page-title">Data Mitra</h2>
        <button className="btn-add" onClick={openAdd}>
          <Plus size={16} /> Tambah Mitra
        </button>
      </div>

      <div className="card">
        <div style={{ padding: "16px 18px 0" }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input placeholder="Cari mitra..." value={q} onChange={(e) => onSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>No</th>
                <th>Nama Mitra</th>
                <th>Kontak</th>
                <th>Alamat</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={5} className="empty">Tidak ada data mitra.</td></tr>
              ) : (
                list.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{m.nama_mitra}</td>
                    <td>{m.kontak}</td>
                    <td>{m.alamat || "-"}</td>
                    <td>
                      <button className="icon-btn edit" onClick={() => openEdit(m)}><Pencil size={16} /></button>
                      <button className="icon-btn delete" onClick={() => del(m.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={editId ? "Edit Mitra" : "Tambah Mitra"} onClose={() => setModal(false)}>
          <div className="form-row">
            <label>Nama Lembaga</label>
            <div className="field">
              <input value={form.nama_mitra} onChange={(e) => setForm({ ...form, nama_mitra: e.target.value })} placeholder="Masukkan nama lembaga" />
            </div>
          </div>
          <div className="form-row">
            <label>Kontak</label>
            <div className="field">
              <input value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} placeholder="Masukkan kontak" />
            </div>
          </div>
          <div className="form-row">
            <label>Alamat</label>
            <div className="field">
              <textarea rows={3} value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Masukkan alamat" />
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
