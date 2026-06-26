import { useEffect, useState } from "react";
import { KeyRound, Camera, UserCircle2 } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Pengaturan() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || {});

  useEffect(() => {
    api.get("/auth/profile").then((res) => setProfile(res.data)).catch(() => {});
  }, []);

  return (
    <>
      <div className="toolbar">
        <h2 className="page-title">Profil Pengguna</h2>
      </div>

      <div className="profile-grid">
        <div className="card">
          <div className="card-head">Informasi Akun</div>
          <div className="profile-info" style={{ padding: 18 }}>
            <div className="row">
              <div className="k">Nama</div>
              <div className="v">{profile.name || "Admin"}</div>
            </div>
            <div className="row">
              <div className="k">Email</div>
              <div className="v">{profile.email || "admin@simrampa.id"}</div>
            </div>
            <div className="row">
              <div className="k">Role</div>
              <div className="v">{profile.role || "Administrator"}</div>
            </div>
            <button className="btn-outline" style={{ marginTop: 8 }}>
              <KeyRound size={16} /> Ubah Password
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-head">Foto Profil</div>
          <div className="avatar-wrap">
            <div className="avatar">
              <UserCircle2 size={90} />
            </div>
            <button className="btn-outline">
              <Camera size={16} /> Ubah Foto
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
