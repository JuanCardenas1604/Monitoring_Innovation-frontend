import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import MobileShell from "../components/mobile/MobileShell";
import { COLORS } from "../utils/constants";

const GENERAL = ["Dark mode", "Notificaciones", "Seguridad"];
const ORG = ["Perfíl", "Mensajes", "Llamadas", "Gente", "Calendario"];

export default function Perfil() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  const Body = (
    <div className="m-profile">
      <div className="m-profile-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
        <span className="m-status-dot" aria-hidden="true" />
      </div>
      <div className="m-profile-status">
        <span style={{ color: "#4CAF50", fontWeight: 700 }}>● </span>
        Disponible {user?.username ? `· ${user.username}` : ""}
      </div>

      <h2 className="m-profile-section-title">General</h2>
      {GENERAL.map((item) => (
        <button key={item} className="m-profile-item" type="button">{item}</button>
      ))}

      <div className="m-profile-divider" />

      <h2 className="m-profile-section-title">Organizacional</h2>
      {ORG.map((item) => (
        <button key={item} className="m-profile-item" type="button">{item}</button>
      ))}

      <button
        type="button"
        onClick={() => logout()}
        className="m-profile-item"
        style={{ color: COLORS.red1, fontWeight: 700, marginTop: 12 }}
      >
        Cerrar sesión
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <MobileShell title="Perfíl" showBottomBlob>
        {Body}
      </MobileShell>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "32px auto", padding: "0 24px" }}>
      <h1 style={{ color: COLORS.navy, fontWeight: 800 }}>Perfil</h1>
      {Body}
    </div>
  );
}
