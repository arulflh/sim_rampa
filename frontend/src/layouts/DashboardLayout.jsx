import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Droplets,
  FileText,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/relawan", label: "Relawan", icon: Users },
  { to: "/mitra", label: "Mitra", icon: Handshake },
  { to: "/penyaluran", label: "Kegiatan Penyaluran", icon: Droplets },
  { to: "/laporan", label: "Laporan", icon: FileText },
  { to: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo size={22} />
          <span>SIM-RAMPA</span>
        </div>
        <nav className="sidebar-nav">
          {menu.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
              >
                <Icon size={18} />
                <span>{m.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-title" id="topbar-title"></div>
          <div className="topbar-user" onClick={() => setMenuOpen((v) => !v)} style={{ cursor: "pointer" }}>
            <span>{user?.name || "Admin"}</span>
            <UserCircle size={22} />
            {menuOpen && (
              <div className="user-menu" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setMenuOpen(false); navigate("/pengaturan"); }}>
                  <UserCircle size={16} /> Profil
                </button>
                <button onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
