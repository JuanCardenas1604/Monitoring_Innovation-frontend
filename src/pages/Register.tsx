import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { COLORS } from "../utils/constants";
import { validateName, validateEmail, validateUsername, validatePassword, validateConfirmPassword, passwordStrength } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";

export default function Register() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ first: false, last: false, email: false, user: false, pass: false, confirm: false });
  const [val, setVal] = useState<Record<string, ValidationResult | null>>({ first: null, last: null, email: null, user: null, pass: null, confirm: null });

  const setField = (field: string, _v: string, result: ValidationResult) => {
    if (touched[field as keyof typeof touched]) setVal(p => ({ ...p, [field]: result }));
  };

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const f = validateName(firstName, "El nombre");
    const l = validateName(lastName, "El apellido");
    const em = validateEmail(email);
    const u = validateUsername(username);
    const p = validatePassword(password);
    const c = validateConfirmPassword(password, confirmPassword);
    setVal({ first: f, last: l, email: em, user: u, pass: p, confirm: c });
    setTouched({ first: true, last: true, email: true, user: true, pass: true, confirm: true });
    if (!f.ok || !l.ok || !em.ok || !u.ok || !p.ok || !c.ok) return;
    setLoading(true);
    try {
      const data = await authApi.register({ email, username, password });
      login(data.access_token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const strength = password ? passwordStrength(password) : [];

  return (
    <div className="auth-page register-bg">
      <div className="auth-blob-bottom pink" />

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand" style={{ marginBottom: 20 }}>
          <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 56, height: 56 }} />
          <div className="auth-brand-divider" />
          <div className="auth-brand-text">Manager</div>
        </div>

        {error && (
          <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 16, alignItems: "center", width: "100%", marginBottom: 16 }}>
          <div className="field-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="field-label">Nombre</label>
            <input className="field-input" type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setField("first", e.target.value, validateName(e.target.value, "El nombre")); }} onBlur={() => { setTouched(p => ({ ...p, first: true })); setVal(v => ({ ...v, first: validateName(firstName, "El nombre") })); }} placeholder="NOMBRE" style={touched.first && val.first && !val.first.ok ? { borderColor: COLORS.pink } : val.first?.ok ? { borderColor: COLORS.cyan } : {}} />
            {touched.first && val.first && !val.first.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.first.message}</span>}
          </div>
          <span style={{ fontSize: "1.5rem", color: COLORS.grey3, fontWeight: 300, marginTop: 20, flexShrink: 0 }}>+</span>
          <div className="field-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="field-label">Apellido</label>
            <input className="field-input" type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setField("last", e.target.value, validateName(e.target.value, "El apellido")); }} onBlur={() => { setTouched(p => ({ ...p, last: true })); setVal(v => ({ ...v, last: validateName(lastName, "El apellido") })); }} placeholder="APELLIDO" style={touched.last && val.last && !val.last.ok ? { borderColor: COLORS.pink } : val.last?.ok ? { borderColor: COLORS.cyan } : {}} />
            {touched.last && val.last && !val.last.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.last.message}</span>}
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Correo</label>
          <input className="field-input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setField("email", e.target.value, validateEmail(e.target.value)); }} onBlur={() => { setTouched(p => ({ ...p, email: true })); setVal(v => ({ ...v, email: validateEmail(email) })); }} placeholder="correo@ejemplo.com" style={touched.email && val.email && !val.email.ok ? { borderColor: COLORS.pink } : val.email?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.email && val.email && !val.email.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.email.message}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Usuario</label>
          <input className="field-input" type="text" value={username} onChange={(e) => { setUsername(e.target.value); setField("user", e.target.value, validateUsername(e.target.value)); }} onBlur={() => { setTouched(p => ({ ...p, user: true })); setVal(v => ({ ...v, user: validateUsername(username) })); }} placeholder="tu_usuario" style={touched.user && val.user && !val.user.ok ? { borderColor: COLORS.pink } : val.user?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.user && val.user && !val.user.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.user.message}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Contraseña</label>
          <input className="field-input" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setField("pass", e.target.value, validatePassword(e.target.value)); }} onBlur={() => { setTouched(p => ({ ...p, pass: true })); setVal(v => ({ ...v, pass: validatePassword(password) })); }} placeholder="••••••••" style={touched.pass && val.pass && !val.pass.ok ? { borderColor: COLORS.pink } : val.pass?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.pass && val.pass && !val.pass.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.pass.message}</span>}
          {touched.pass && password && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
              {strength.map((s, i) => (
                <span key={i} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 20, background: s.ok ? COLORS.cyanPale : COLORS.pinkPale, color: s.ok ? COLORS.cyan : COLORS.pink, fontWeight: 600 }}>{s.ok ? "✓" : "✗"} {s.label}</span>
              ))}
            </div>
          )}
        </div>

        <div className="field-group">
          <label className="field-label">Confirmar Contraseña</label>
          <input className="field-input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setField("confirm", e.target.value, validateConfirmPassword(password, e.target.value)); }} onBlur={() => { setTouched(p => ({ ...p, confirm: true })); setVal(v => ({ ...v, confirm: validateConfirmPassword(password, confirmPassword) })); }} placeholder="••••••••" style={touched.confirm && val.confirm && !val.confirm.ok ? { borderColor: COLORS.pink } : val.confirm?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.confirm && val.confirm && !val.confirm.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.confirm.message}</span>}
        </div>

        <p style={{ fontSize: "0.78rem", color: "#888", textAlign: "center", margin: "14px 0 20px", lineHeight: 1.5 }}>
          Al hacer clic en crear cuenta, acepta los términos de las{" "}
          <a href="#">políticas de privacidad</a> y <a href="#">términos del servicio</a>
        </p>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: "none" }}>← Volver</Link>
          <button type="submit" className="btn-outline" style={{ flex: 1 }} disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
