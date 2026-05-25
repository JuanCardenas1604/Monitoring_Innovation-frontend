import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/auth";
import { COLORS } from "../utils/constants";
import { validateEmail } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailVal, setEmailVal] = useState<ValidationResult | null>(null);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const v = validateEmail(email);
    setEmailVal(v);
    setTouched(true);
    if (!v.ok) return;
    setLoading(true);
    try {
      const data = await authApi.forgotPassword({ email });
      setMessage(data.message);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

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
          Digite el correo electrónico con el que se registró la cuenta:
        </p>

        {error && (
          <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ width: "100%", background: COLORS.cyanPale, border: `1px solid ${COLORS.cyan}`, color: COLORS.navy, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
            {message}
          </div>
        )}

        <div className="field-group">
          <label className="field-label">Email</label>
          <input className="field-input" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (touched) setEmailVal(validateEmail(e.target.value)); }} onBlur={() => { setTouched(true); setEmailVal(validateEmail(email)); }} autoFocus placeholder="demo@gmail.com" style={touched && emailVal && !emailVal.ok ? { borderColor: COLORS.pink } : emailVal?.ok ? { borderColor: COLORS.cyan } : {}} />
          {touched && emailVal && !emailVal.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{emailVal.message}</span>}
        </div>

        <button className="btn-primary" type="submit" disabled={loading} style={{ margin: "12px 0 0" }}>
          {loading ? "Enviando..." : "Enviar correo"}
        </button>
      </form>

      <Link to="/login" className="btn-secondary" style={{ position: "relative", marginTop: 24, zIndex: 3, textDecoration: "none" }}>
        ← Volver
      </Link>
    </div>
  );
}
