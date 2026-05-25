import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <motion.nav
      className="m-bottomnav"
      aria-label="Navegación principal"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.32, ease: easeOut }}
    >
      <NavLink to="/dashboard" className={({ isActive }) => `m-bottomnav-item${isActive ? " active" : ""}`} aria-label="Formulario">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
        <span>Formulario</span>
      </NavLink>

      <NavLink to="/catalogo" className={({ isActive }) => `m-bottomnav-item${isActive ? " active" : ""}`} aria-label="Catálogo">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M7 10h10M7 14h6" />
          <path d="M8 6V4h8v2" />
        </svg>
        <span>Catálogo</span>
      </NavLink>

      <NavLink to="/perfil" className={({ isActive }) => `m-bottomnav-item${isActive ? " active" : ""}`} aria-label="Perfil">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
        <span>Perfil</span>
      </NavLink>
    </motion.nav>
  );
}
