import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { COLORS } from "../utils/constants";
import { validateUsername, validatePassword } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userVal, setUserVal] = useState<ValidationResult | null>(null);
  const [passVal, setPassVal] = useState<ValidationResult | null>(null);
  const [touched, setTouched] = useState({ user: false, pass: false });
  const expired = searchParams.get("expired");

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const u = validateUsername(username);
    const p = validatePassword(password);
    setUserVal(u);
    setPassVal(p);
    setTouched({ user: true, pass: true });
    if (!u.ok) return;
    if (!p.ok) return;
    setLoading(true);
    try {
      const data = await authApi.login({ username, password });
      login(data.access_token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUserChange = (v: string) => {
    setUsername(v);
    if (touched.user) setUserVal(validateUsername(v));
  };
  
  const handlePassChange = (v: string) => {
    setPassword(v);
    if (touched.pass) setPassVal(validatePassword(v));
  };

  return (
    <div className="auth-page login-bg">
      <div className="auth-blob-bottom cyan" />

      <div style={{ position: "absolute", top: 24, left: 32, zIndex: 10 }}>
        <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 40, height: 40 }} />
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 56, height: 56 }} />
          <div className="auth-brand-divider" />
          <div className="auth-brand-text">Manager</div>
        </div>

        {expired && (
          <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            Tu sesión ha expirado. Inicia sesión nuevamente.
          </div>
        )}

        {error && (
          <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div className="field-group">
          <label className="field-label">Usuario</label>
          <input className="field-input" type="text" value={username} onChange={(e) => handleUserChange(e.target.value)} onBlur={() => { setTouched(u => ({ ...u, user: true })); setUserVal(validateUsername(username)); }} autoFocus placeholder="tu_usuario" style={touched.user && userVal && !userVal.ok ? { borderColor: COLORS.pink } : userVal?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.user && userVal && !userVal.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 3 }}>{userVal.message}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Contraseña</label>
          <input className="field-input" type="password" value={password} onChange={(e) => handlePassChange(e.target.value)} onBlur={() => { setTouched(p => ({ ...p, pass: true })); setPassVal(validatePassword(password)); }} placeholder="••••••••" style={touched.pass && passVal && !passVal.ok ? { borderColor: COLORS.pink } : passVal?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.pass && passVal && !passVal.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 3 }}>{passVal.message}</span>}
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: "0.88rem", marginBottom: 28 }}>
          <Link to="/forgot-password" style={{ color: COLORS.pink, fontWeight: 600 }}>Olvide <strong>Mi</strong> contraseña</Link>
          <Link to="/register" className="register" style={{ color: COLORS.pink, fontWeight: 800 }}>Registrarse</Link>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button type="button" className="login-icon-btn" title="Info" style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 10px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.4rem", color: COLORS.pink }}>ⓘ</button>
          <button type="button" className="login-icon-btn" title="Perfil" style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 10px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.4rem", color: COLORS.cyan }}>👤</button>
        </div>
      </form>
    </div>
  );
}
