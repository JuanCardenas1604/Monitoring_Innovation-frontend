import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../utils/constants";
import { useIsMobile } from "../hooks/useIsMobile";
import Splash from "./mobile/Splash";

const externalLinks = [
  { label: "Repositorio Frontend", url: "https://github.com/JuanCardenas1604/Monitoring_Innovation-frontend.git", navy: false },
  { label: "Repositorio Backend", url: "https://github.com/JuanCardenas1604/Monitoring-Innovation-Backend.git", navy: true },
  { label: "MONITORINGINNOVATION", url: "https://monitoringinnovation.com/", navy: false },
  { label: "GPS CONTROL", url: "https://gpscontrol.co/", navy: true },
];

const BG_FRAME_COUNT = 12;
const BG_FRAMES = Array.from({ length: BG_FRAME_COUNT }, (_, i) =>
  `/assets/bg-frame-${String(i + 1).padStart(2, "0")}.png`
);
const FRAME_INTERVAL_MS = 300;
const FRAME_FADE_MS = 600;

export default function Home() {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (isMobile) return;
    BG_FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % BG_FRAME_COUNT);
    }, FRAME_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isMobile]);

  if (isMobile) return <Splash />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Nav tabs */}
      <nav className="nav-tabs">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 16, textDecoration: "none" }}>
          <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 28, height: 28 }} />
        </Link>
        <Link to="/" className="nav-tab active">Home</Link>
        {user && <Link to="/dashboard" className="nav-tab">Dashboard</Link>}
        {user?.role === "admin" && <Link to="/users" className="nav-tab">Usuarios</Link>}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontSize: "0.82rem", color: "#888", fontWeight: 600 }}>
                {user.username} <span style={{ color: "#aaa", fontWeight: 400, fontSize: "0.72rem" }}>({user.role})</span>
              </span>
              <button onClick={() => logout()} style={{ padding: "6px 14px", border: "1.5px solid #eee", borderRadius: 20, background: "transparent", color: "#888", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" style={{ padding: "6px 14px", border: `1.5px solid ${COLORS.cyan}`, borderRadius: 20, background: "transparent", color: COLORS.navy, fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", textDecoration: "none" }}>
              Ingresar
            </Link>
          )}
        </div>
      </nav>

      <div style={{ position: "absolute", top: 64, left: 36, display: "flex", alignItems: "center", gap: 6, zIndex: 2 }}>
        <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 44, height: 44 }} />
      </div>

      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {BG_FRAMES.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            decoding="async"
            loading="eager"
            initial={false}
            animate={{ opacity: i === frame ? 1 : 0 }}
            transition={{ duration: FRAME_FADE_MS / 1000, ease: [0.45, 0, 0.55, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              willChange: "opacity",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, padding: "100px 40px 40px", textAlign: "center", position: "relative" }}>
        <img
          src="/assets/home-hero.png"
          alt="Bienvenido a Monitoring Innovation"
          className="home-hero-image"
          style={{ width: "100%", maxWidth: 900, height: "auto", display: "block" }}
        />

        {!user && (
          <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
            <Link to="/login" className="btn-primary" style={{ margin: 0, textDecoration: "none" }}>Iniciar sesión</Link>
            <Link to="/register" className="btn-outline" style={{ margin: 0, textDecoration: "none" }}>Registrarse</Link>
          </div>
        )}
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 80px)", padding: "24px 32px 32px", borderTop: "1px solid #eee", zIndex: 1, flexWrap: "wrap" }}>
        {externalLinks.map((link) => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: link.navy ? COLORS.navy : COLORS.pink, cursor: "pointer", transition: "color .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = link.navy ? COLORS.pink : COLORS.navy; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = link.navy ? COLORS.navy : COLORS.pink; }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
