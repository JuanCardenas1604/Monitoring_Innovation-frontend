import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../api/users";
import type { User } from "../types";
import { COLORS } from "../utils/constants";
import { validateEmail, validateUsername, validatePassword, passwordStrength } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [error, setError] = useState("");
  const [createVal, setCreateVal] = useState<Record<string, ValidationResult | null>>({});
  const [createTouch, setCreateTouch] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.list();
        setUsers(data);
      } catch { /* handled by interceptor */ }
      finally { setLoading(false); }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "viewer") => {
    try {
      await usersApi.updateRole(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch { /* handled by interceptor */ }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const em = validateEmail(email);
    const u = validateUsername(username);
    const p = validatePassword(password);
    setCreateVal({ email: em, user: u, pass: p });
    setCreateTouch({ email: true, user: true, pass: true });
    if (!em.ok || !u.ok || !p.ok) return;
    try {
      await usersApi.registerAdmin({ email, username, password, role });
      setShowCreate(false);
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("viewer");
      setCreateVal({});
      setCreateTouch({});
      const data = await usersApi.list();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al crear usuario");
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeletingId(deleteTarget.id);
    await new Promise((r) => setTimeout(r, 350));
    try {
      await usersApi.delete(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setToast(`Usuario "${deleteTarget.username}" eliminado`);
    } catch { /* handled by interceptor */ }
    finally {
      setDeleteTarget(null);
      setDeleting(false);
      setDeletingId(null);
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <div style={{ padding: "3rem 2rem", textAlign: "center", color: COLORS.grey3 }}>
        No tienes permisos para ver esta página.
      </div>
    );
  }

  return (
    <div style={{ padding: "48px 64px", background: "#fff", minHeight: "calc(100vh - 52px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: "2rem", color: COLORS.navy, textTransform: "uppercase" }}>
          Usuarios
        </h1>
        <button className="btn-primary" style={{ margin: 0 }} onClick={() => setShowCreate(true)}>
          + Crear usuario
        </button>
      </div>

      {loading ? (
        <p style={{ color: COLORS.grey3 }}>Cargando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {users.map((u) => (
            <div key={u.id} className="create-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 4 }}>{u.username}</div>
                <div style={{ fontSize: "0.85rem", color: COLORS.grey3 }}>{u.email}</div>
                <div style={{ fontSize: "0.78rem", color: COLORS.cyan, marginTop: 2 }}>
                  {u.is_active ? "Activo" : "Inactivo"} · Creado {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ padding: "4px 14px", borderRadius: 30, fontSize: "0.82rem", fontWeight: 700, background: u.role === "admin" ? COLORS.cyanPale : COLORS.pinkPale, color: u.role === "admin" ? COLORS.cyan : COLORS.pink }}>
                  {u.role === "admin" ? "Admin" : "Viewer"}
                </div>
                {u.id !== currentUser?.id && (
                  <>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as "admin" | "viewer")}
                      className="field-input-2"
                      style={{ width: "auto", padding: "6px 12px", cursor: "pointer" }}
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      disabled={deletingId === u.id}
                      style={{
                        background: "transparent",
                        border: "1.5px solid #ddd",
                        borderRadius: 8,
                        color: COLORS.pink,
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1,
                        padding: "6px 12px",
                        cursor: "pointer",
                        opacity: deletingId === u.id ? 0.5 : 1,
                      }}
                    >
                      {deletingId === u.id ? "..." : "✕"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create user modal */}
      <div className={`modal-overlay${showCreate ? " open" : ""}`}>
        <form className="modal-box" onSubmit={handleCreate} style={{ textAlign: "left", maxWidth: 420 }}>
          <div className="modal-title" style={{ textAlign: "center", marginBottom: 20 }}>Crear usuario</div>

          {error && (
            <div style={{ width: "100%", background: COLORS.pinkPale, border: `1px solid ${COLORS.pink}`, color: COLORS.pink, padding: "8px 12px", borderRadius: 10, marginBottom: 16, fontSize: "0.82rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email} onChange={e => { setEmail(e.target.value); if (createTouch.email) setCreateVal(v => ({ ...v, email: validateEmail(e.target.value) })); }} onBlur={() => { setCreateTouch(t => ({ ...t, email: true })); setCreateVal(v => ({ ...v, email: validateEmail(email) })); }} placeholder="correo@ejemplo.com" style={createTouch.email && createVal.email && !createVal.email.ok ? { borderColor: COLORS.pink } : createVal.email?.ok ? { borderColor: COLORS.cyan } : {}} />
            {createTouch.email && createVal.email && !createVal.email.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{createVal.email.message}</span>}
          </div>
          <div className="field-group">
            <label className="field-label">Usuario</label>
            <input className="field-input" type="text" value={username} onChange={e => { setUsername(e.target.value); if (createTouch.user) setCreateVal(v => ({ ...v, user: validateUsername(e.target.value) })); }} onBlur={() => { setCreateTouch(t => ({ ...t, user: true })); setCreateVal(v => ({ ...v, user: validateUsername(username) })); }} placeholder="usuario" style={createTouch.user && createVal.user && !createVal.user.ok ? { borderColor: COLORS.pink } : createVal.user?.ok ? { borderColor: COLORS.cyan } : {}} />
            {createTouch.user && createVal.user && !createVal.user.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{createVal.user.message}</span>}
          </div>
          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <input className="field-input" type="password" value={password} onChange={e => { setPassword(e.target.value); if (createTouch.pass) setCreateVal(v => ({ ...v, pass: validatePassword(e.target.value) })); }} onBlur={() => { setCreateTouch(t => ({ ...t, pass: true })); setCreateVal(v => ({ ...v, pass: validatePassword(password) })); }} placeholder="••••••" style={createTouch.pass && createVal.pass && !createVal.pass.ok ? { borderColor: COLORS.pink } : createVal.pass?.ok ? { borderColor: COLORS.cyan } : {}} />
            {createTouch.pass && createVal.pass && !createVal.pass.ok && <span style={{ fontSize: "0.72rem", color: COLORS.pink, marginTop: 2 }}>{createVal.pass.message}</span>}
            {createTouch.pass && password && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                {passwordStrength(password).map((s, i) => (
                  <span key={i} style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 20, background: s.ok ? COLORS.cyanPale : COLORS.pinkPale, color: s.ok ? COLORS.cyan : COLORS.pink, fontWeight: 600 }}>{s.ok ? "✓" : "✗"} {s.label}</span>
                ))}
              </div>
            )}
          </div>
          <div className="field-group">
            <label className="field-label">Rol</label>
            <select className="field-input" value={role} onChange={e => setRole(e.target.value as "admin" | "viewer")}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="modal-btns" style={{ marginTop: 20 }}>
            <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancelar</button>
            <button type="submit" className="btn-outline" style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Crear</button>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: COLORS.navy, color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: "0.85rem", fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}

      {/* Confirm delete modal */}
      <div className={`modal-overlay${deleteTarget ? " open" : ""}`} onClick={() => !deleting && setDeleteTarget(null)}>
        <div className="modal-box" style={{ maxWidth: 400, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-title" style={{ marginBottom: 12 }}>Eliminar usuario</div>
          <p style={{ color: COLORS.grey3, fontSize: "0.9rem", marginBottom: 24 }}>
            ¿Estás seguro de eliminar a <strong style={{ color: COLORS.navy }}>{deleteTarget?.username}</strong>?
            <br />
            Esta acción no se puede deshacer.
          </p>
          <div className="modal-btns">
            <button className="btn-ghost" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancelar</button>
            <button className="btn-outline" style={{ borderColor: COLORS.pink, color: COLORS.pink }} onClick={handleDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
