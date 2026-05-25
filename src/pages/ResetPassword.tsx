import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { COLORS } from "../utils/constants";
import { validatePassword, validateConfirmPassword, passwordStrength } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ pass: false, confirm: false });
  const [val, setVal] = useState<Record<string, ValidationResult | null>>({ pass: null, confirm: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const p = validatePassword(password);
    const c = validateConfirmPassword(password, confirmPassword);
    setVal({ pass: p, confirm: c });
    setTouched({ pass: true, confirm: true });
    if (!p.ok) return;
    if (!c.ok) return;
    if (!token) { setError("Token de recuperación inválido o faltante"); return; }
    setLoading(true);
    try {
      const data = await authApi.resetPassword({ token, password });
      setSuccess(data.message);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const strength = password ? passwordStrength(password) : [];

  return (
    <div className="auth-page recovery-bg">
      <div className="auth-blob-bottom cyan" />

      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand" style={{ marginBottom: 24 }}>
          <img src="/assets/vector-logo.svg" alt="MI" style={{ width: 56, height: 56 }} />
          <div className="auth-brand-divider" />
          <div className="auth-brand-text">Manager</div>
        </div>

        <p style={{ fontSize: "0.95rem", color: "#555", width: "100%", marginBottom: 20, lineHeight: 1.5 }}>
          Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
        </p>

        {error && (
          <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ width: "100%", background: COLORS.cyanPale, border: `1px solid ${COLORS.cyan}`, color: COLORS.navy, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {success}
          </div>
        )}

        <div className="field-group">
          <label className="field-label">Nueva contraseña</label>
          <input className="field-input" type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (touched.pass) setVal(v => ({ ...v, pass: validatePassword(e.target.value) })); }} onBlur={() => { setTouched(p => ({ ...p, pass: true })); setVal(v => ({ ...v, pass: validatePassword(password) })); }} autoFocus placeholder="••••••••" style={touched.pass && val.pass && !val.pass.ok ? { borderColor: COLORS.pink } : val.pass?.ok ? { borderColor: COLORS.cyan } : {}} />
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
          <label className="field-label">Confirmar contraseña</label>
          <input className="field-input" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (touched.confirm) setVal(v => ({ ...v, confirm: validateConfirmPassword(password, e.target.value) })); }} onBlur={() => { setTouched(p => ({ ...p, confirm: true })); setVal(v => ({ ...v, confirm: validateConfirmPassword(password, confirmPassword) })); }} placeholder="••••••••" style={touched.confirm && val.confirm && !val.confirm.ok ? { borderColor: COLORS.pink } : val.confirm?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched.confirm && val.confirm && !val.confirm.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{val.confirm.message}</span>}
        </div>

        <button className="btn-primary" type="submit" disabled={loading} style={{ margin: "12px 0 0" }}>
          {loading ? "Restableciendo..." : "Restablecer contraseña"}
        </button>
      </form>

      <Link to="/login" className="btn-secondary" style={{ position: "relative", marginTop: 24, zIndex: 3, textDecoration: "none" }}>
        ← Volver
      </Link>
    </div>
  );
}
