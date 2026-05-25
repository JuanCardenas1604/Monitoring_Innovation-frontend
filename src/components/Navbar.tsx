import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (paths: string[]) => paths.some(p => location.pathname.startsWith(p));

  const tabs = [
    { path: "/", label: "Home", paths: ["/"], exact: true },
    { path: "/dashboard", label: "Dashboard", paths: ["/dashboard", "/vehicles"] },
    { path: "/users", label: "Usuarios", paths: ["/users"], adminOnly: true },
  ];

  return (
    <nav className="nav-tabs">
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 16, textDecoration: "none" }}>
        <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 28, height: 28 }} />
      </Link>

      {tabs.map((tab) => {
        if (tab.adminOnly && user?.role !== "admin") return null;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`nav-tab${isActive(tab.paths) ? " active" : ""}`}
          >
            {tab.label}
          </Link>
        );
      })}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: "0.82rem", color: "#888", fontWeight: 600 }}>
          {user?.username} <span style={{ color: "#aaa", fontWeight: 400, fontSize: "0.72rem" }}>({user?.role})</span>
        </span>
        <button onClick={() => logout()} style={{ padding: "6px 14px", border: "1.5px solid #eee", borderRadius: 20, background: "transparent", color: "#888", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
          Salir
        </button>
      </div>
    </nav>
  );
}
