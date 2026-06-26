import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, ChevronRight } from "lucide-react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";

const PER_PAGE = 4;
const EMPTY = { nama_relawan: "", no_hp: "", email: "", alamat: "" };

export default function Relawan() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);

  const load = (search = "") => {
    api.get("/relawan", { params: search ? { q: search } : {} })
      .then((res) => setList(res.data))
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const onSearch = (val) => {
    setQ(val);
    setPage(1);
    load(val);
  };

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (r) => {
    setForm({ nama_relawan: r.nama_relawan, no_hp: r.no_hp, email: r.email || "", alamat: r.alamat || "" });
    setEditId(r.id);
    setModal(true);
  };

  const save = async () => {
    if (!form.nama_relawan || !form.no_hp) return;
    if (editId) await api.put(`/relawan/${editId}`, form);
    else await api.post("/relawan", form);
    setModal(false);
    load(q);
  };

  const del = async (id) => {
    if (!confirm("Hapus data relawan ini?")) return;
    await api.delete(`/relawan/${id}`);
    load(q);
  };

  const totalPages = Math.ceil(list.length / PER_PAGE) || 1;
  const paged = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      <div className="toolbar">
        <h2 className="page-title">Data Relawan</h2>
        <button className="btn-add" onClick={openAdd}>
          <Plus size={16} /> Tambah Relawan
        </button>
      </div>

      <div className="card">
        <div style={{ padding: "16px 18px 0" }}>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              placeholder="Cari relawan..."
              value={q}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 60 }}>No</th>
                <th>Nama</th>
                <th>No. HP</th>
                <th>Email</th>
                <th style={{ width: 100 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={5} className="empty">Tidak ada data relawan.</td></tr>
              ) : (
                paged.map((r, i) => (
                  <tr key={r.id}>
                    <td>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td>{r.nama_relawan}</td>
                    <td>{r.no_hp}</td>
                    <td>{r.email || "-"}</td>
                    <td>
                      <button className="icon-btn edit" onClick={() => openEdit(r)}><Pencil size={16} /></button>
                      <button className="icon-btn delete" onClick={() => del(r.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}><ChevronRight size={16} /></button>
        </div>
      </div>

      {modal && (
        <Modal title={editId ? "Edit Relawan" : "Tambah Relawan"} onClose={() => setModal(false)}>
          <div className="form-row">
            <label>Nama Lengkap</label>
            <div className="field">
              <input value={form.nama_relawan} onChange={(e) => setForm({ ...form, nama_relawan: e.target.value })} placeholder="Masukkan nama" />
            </div>
          </div>
          <div className="form-row">
            <label>No. HP</label>
            <div className="field">
              <input value={form.no_hp} onChange={(e) => setForm({ ...form, no_hp: e.target.value })} placeholder="Masukkan nomor HP" />
            </div>
          </div>
          <div className="form-row">
            <label>Email</label>
            <div className="field">
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Masukkan email" />
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
