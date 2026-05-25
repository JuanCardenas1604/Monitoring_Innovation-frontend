import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { vehiclesApi } from "../api/vehicles";
import type { Vehicle } from "../types";
import { COLORS } from "../utils/constants";
import { validateVehicleBrand, validateVehicleLocation, validateVehicleApplicant, validateYear, validatePrice } from "../utils/validation";
import type { ValidationResult } from "../utils/validation";
import { useIsMobile } from "../hooks/useIsMobile";
import MobileShell from "../components/mobile/MobileShell";
import MobileEditModal from "../components/mobile/MobileEditModal";
import MobileToast from "../components/mobile/MobileToast";

type CardState = 0 | 1 | 2;

const PAGE_SIZE = 10;

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [cardState, setCardState] = useState<CardState>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [applicant, setApplicant] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [fieldVal, setFieldVal] = useState<Record<string, ValidationResult | null>>({});
  const [fieldTouch, setFieldTouch] = useState<Record<string, boolean>>({});
  const touch = (f: string) => { setFieldTouch(p => ({ ...p, [f]: true })); };

  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const isAdmin = user?.role === "admin";
  const formLocked = !isAdmin;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const fetchVehicles = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await vehiclesApi.list({
        skip: (pageNum - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const maxPage = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
      const safePage = Math.min(pageNum, maxPage);
      if (safePage !== pageNum) {
        setPage(safePage);
        return;
      }
      setVehicles(data.items);
      setTotal(data.total);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVehicles(page); }, [page, fetchVehicles]);

  const resetForm = () => {
    setBrand("");
    setLocation("");
    setApplicant("");
    setYear("");
    setPrice("");
    setDescription("");
    setEditingId(null);
    setCardState(0);
    setFieldVal({});
    setFieldTouch({});
  };

  useEffect(() => {
    if (formLocked && cardState !== 0) resetForm();
  }, [formLocked, cardState]);

  const openCreate = () => {
    if (formLocked) return;
    resetForm();
    setCardState(1);
  };

  const openEdit = (v: Vehicle) => {
    if (formLocked) return;
    setBrand(v.brand);
    setLocation(v.location);
    setApplicant(v.applicant);
    setYear(v.year?.toString() || "");
    setPrice(v.price?.toString() || "");
    setDescription(v.description || "");
    setEditingId(v.id);
    setCardState(2);
  };

  const handleCreate = async () => {
    if (formLocked) return;
    const b = validateVehicleBrand(brand);
    const l = validateVehicleLocation(location);
    const a = validateVehicleApplicant(applicant);
    const y = validateYear(year);
    const p = validatePrice(price);
    setFieldVal({ brand: b, location: l, applicant: a, year: y, price: p });
    setFieldTouch({ brand: true, location: true, applicant: true, year: true, price: true });
    if (!b.ok || !l.ok || !a.ok || !y.ok || !p.ok) return;
    try {
      await vehiclesApi.create({
        brand, location, applicant,
        year: year ? parseInt(year) : null,
        price: price ? parseFloat(price) : null,
        description: description || null,
      });
      showToast("Registro creado ✓");
      resetForm();
      if (page === 1) fetchVehicles(1);
      else setPage(1);
    } catch { showToast("Error al crear registro"); }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const b = validateVehicleBrand(brand);
    const l = validateVehicleLocation(location);
    const a = validateVehicleApplicant(applicant);
    const y = validateYear(year);
    const p = validatePrice(price);
    setFieldVal({ brand: b, location: l, applicant: a, year: y, price: p });
    setFieldTouch({ brand: true, location: true, applicant: true, year: true, price: true });
    if (!b.ok || !l.ok || !a.ok || !y.ok || !p.ok) return;
    try {
      await vehiclesApi.update(editingId, {
        brand, location, applicant,
        year: year ? parseInt(year) : null,
        price: price ? parseFloat(price) : null,
        description: description || null,
      });
      showToast("Registro actualizado ✓");
      resetForm();
      fetchVehicles(page);
    } catch { showToast("Error al actualizar registro"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    await new Promise(r => setTimeout(r, 350));
    try {
      await vehiclesApi.delete(deleteTarget);
      showToast("Registro eliminado");
      setDeleteTarget(null);
      setDeletingId(null);
      const nextPage = vehicles.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) setPage(nextPage);
      else fetchVehicles(page);
    } catch { showToast("Error al eliminar registro"); setDeletingId(null); }
  };

  // ───────── MOBILE LAYOUT ─────────
  if (isMobile) {
    const toastVariant: "success" | "error" = toast.toLowerCase().includes("error") ? "error" : "success";
    const showFormCard = cardState === 1 || (cardState === 0 && !formLocked);
    const modalOpen = cardState === 2 && !formLocked;

    return (
      <MobileShell title="formulario">
        {/* Form card */}
        <div className="m-formcard" style={formLocked ? { opacity: 0.6, pointerEvents: "none" } : undefined}>
          <div className="m-formcard-header">
            <button
              type="button"
              className="m-formcard-plus"
              onClick={() => (cardState === 0 ? openCreate() : resetForm())}
              disabled={formLocked}
              aria-label={cardState === 0 ? "Crear vehículo" : "Cancelar"}
            >+</button>
          </div>

          {showFormCard && (
            <>
              <div className="m-formrow">
                <span className="m-formrow-icon" style={{ color: COLORS.red1 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="11" rx="2" />
                    <circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
                  </svg>
                </span>
                <input className="m-formrow-input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Modelo" disabled={cardState === 0 || formLocked} />
              </div>

              <div className="m-formrow">
                <span className="m-formrow-icon" style={{ color: COLORS.red1 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <input className="m-formrow-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Sucursal" disabled={cardState === 0 || formLocked} />
              </div>

              <div className="m-formrow">
                <span className="m-formrow-icon" style={{ color: COLORS.red1 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                  </svg>
                </span>
                <input className="m-formrow-input" value={applicant} onChange={(e) => setApplicant(e.target.value)} placeholder="Nombre Apellido" disabled={cardState === 0 || formLocked} />
              </div>

              <div className="m-formrow">
                <span className="m-formrow-icon" style={{ color: COLORS.red1 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M3 10h18M8 3v4M16 3v4" />
                  </svg>
                </span>
                <input className="m-formrow-input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Año" inputMode="numeric" disabled={cardState === 0 || formLocked} />
              </div>

              <div className="m-formrow">
                <span className="m-formrow-icon" style={{ color: COLORS.red1 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18" />
                    <path d="M17 6H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6" />
                  </svg>
                </span>
                <input className="m-formrow-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" inputMode="decimal" disabled={cardState === 0 || formLocked} />
              </div>

              <div className="m-formrow" style={{ alignItems: "flex-start" }}>
                <span className="m-formrow-icon" style={{ color: COLORS.red1, marginTop: 8 }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M14 3v6h6M8 13h8M8 17h6" />
                  </svg>
                </span>
                <textarea
                  className="m-formrow-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción"
                  rows={2}
                  disabled={cardState === 0 || formLocked}
                  style={{ resize: "none", padding: "10px 16px", lineHeight: 1.3, fontFamily: "var(--font)" }}
                />
              </div>
            </>
          )}

          {cardState === 1 && (
            <div className="m-formcard-actions">
              <button className="m-modal-btn" style={{ width: 50, height: 46 }} onClick={resetForm} aria-label="Cancelar">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M7 12h10" />
                </svg>
              </button>
              <button className="m-modal-btn" style={{ width: 50, height: 46 }} onClick={handleCreate} aria-label="Confirmar">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="m-table-wrap">
          {loading ? (
            <p style={{ color: COLORS.grey3, textAlign: "center", padding: "2rem" }}>Cargando...</p>
          ) : vehicles.length === 0 ? (
            <p style={{ color: COLORS.grey3, textAlign: "center", padding: "2rem 1rem", fontSize: "0.86rem" }}>
              {isAdmin ? "Aún no hay vehículos. Toca + para crear el primero." : "No hay vehículos disponibles."}
            </p>
          ) : (
            <>
              <table className="m-table">
                <thead>
                  <tr>
                    <th style={{ width: "26%" }}>Marca</th>
                    <th style={{ width: "26%" }}>Sucursal</th>
                    <th style={{ width: "28%" }}>Aspirante</th>
                    <th style={{ width: "20%" }} aria-label="Acciones"></th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td title={v.brand}>{v.brand}</td>
                      <td title={v.location}>{v.location}</td>
                      <td title={v.applicant}>{v.applicant}</td>
                      <td className="m-cell-actions">
                        {isAdmin && (
                          <div className="m-row-actions">
                            <button onClick={() => openEdit(v)} aria-label="Editar" title="Editar">
                              <img src="/assets/listos-1.svg" alt="" />
                            </button>
                            <button onClick={() => setDeleteTarget(v.id)} aria-label="Eliminar" title="Eliminar">
                              <img src="/assets/exclude-1.svg" alt="" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {total > PAGE_SIZE && (
                <nav className="pagination" aria-label="Paginación de vehículos" style={{ justifyContent: "center", gap: 10 }}>
                  <button type="button" className="pagination-btn" onClick={() => setPage((p) => p - 1)} disabled={page <= 1 || loading} aria-label="Anterior">←</button>
                  <span className="pagination-label" style={{ minWidth: 90, fontSize: "0.76rem" }}>{page} / {totalPages}</span>
                  <button type="button" className="pagination-btn" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || loading} aria-label="Siguiente">→</button>
                </nav>
              )}
            </>
          )}
        </div>

        {/* Edit modal */}
        <MobileEditModal
          open={modalOpen}
          fields={[
            { key: "brand", value: brand, placeholder: "Modelo", onChange: setBrand },
            { key: "location", value: location, placeholder: "Sucursal", onChange: setLocation },
            { key: "applicant", value: applicant, placeholder: "Nombre Apellido", onChange: setApplicant },
            { key: "year", value: year, placeholder: "Año", onChange: setYear, inputMode: "numeric" },
            { key: "price", value: price, placeholder: "Precio", onChange: setPrice, inputMode: "decimal" },
            { key: "description", value: description, placeholder: "Descripción", onChange: setDescription, multiline: true },
          ]}
          onCancel={resetForm}
          onConfirm={handleUpdate}
        />

        {/* Delete confirmation */}
        <div className={`m-modal-overlay${deleteTarget ? " open" : ""}`} onClick={() => setDeleteTarget(null)}>
          <div className="m-modal-card" style={{ background: "#fff", color: COLORS.navy, padding: 24, boxShadow: "0 20px 60px rgba(0,36,156,0.18)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 800, color: COLORS.navy, textAlign: "center", fontSize: "1rem" }}>¿Eliminar registro?</div>
            <p style={{ fontSize: "0.82rem", color: "#888", textAlign: "center", marginTop: 4 }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 10 }}>
              <button onClick={() => setDeleteTarget(null)} style={{ padding: "8px 22px", border: "1.5px solid #ccc", borderRadius: 24, background: "transparent", color: "#888", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>Cancelar</button>
              <button onClick={handleDelete} style={{ padding: "8px 22px", border: "none", borderRadius: 24, background: COLORS.red1, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>Eliminar</button>
            </div>
          </div>
        </div>

        <MobileToast message={toast || "Concepto confirmado"} variant={toastVariant} visible={!!toast} />
      </MobileShell>
    );
  }

  // ───────── DESKTOP LAYOUT ─────────
  return (
    <div className="dashboard-page">
      <div className="dashboard-left">
          <div className="create-card" style={formLocked ? { opacity: 0.65, pointerEvents: "none" } : undefined}>
          <div className="create-card-header">
            <button
              type="button"
              className="btn-add"
              onClick={openCreate}
              disabled={formLocked}
              title={formLocked ? "Solo administradores pueden crear vehículos" : "Crear vehículo"}
              style={{ background: "none", border: "none", color: formLocked ? COLORS.grey3 : COLORS.cyan, fontSize: "1.6rem", fontWeight: 700, cursor: formLocked ? "not-allowed" : "pointer", lineHeight: 1, transition: "transform .15s" }}
              onMouseEnter={e => { if (!formLocked) e.currentTarget.style.transform = "scale(1.18) rotate(90deg)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; }}
            >+</button>
          </div>

          <div className={`card-body${cardState === 0 || formLocked ? " collapsed" : ""}`}>
            <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="field-icon active">
                  <svg viewBox="0 0 24 24"><path d="M5 11L6.5 6.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M3 15h18M7 15v2m10-2v2M4 11h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                </span>
                <input className="field-input-2" value={brand} onChange={e => { setBrand(e.target.value); if (fieldTouch.brand) setFieldVal(f => ({ ...f, brand: validateVehicleBrand(e.target.value) })); }} onBlur={() => { touch("brand"); setFieldVal(f => ({ ...f, brand: validateVehicleBrand(brand) })); }} placeholder="Marca" disabled={formLocked} readOnly={formLocked} style={fieldTouch.brand && fieldVal.brand && !fieldVal.brand.ok ? { borderColor: COLORS.pink } : fieldVal.brand?.ok ? { borderColor: COLORS.cyan } : {}} />
              </div>
              {fieldTouch.brand && fieldVal.brand && !fieldVal.brand.ok && <span style={{ fontSize: "0.7rem", color: COLORS.pink, marginLeft: 36 }}>{fieldVal.brand.message}</span>}
            </div>

            <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="field-icon active">
                  <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                </span>
                <input className="field-input-2" value={location} onChange={e => { setLocation(e.target.value); if (fieldTouch.location) setFieldVal(f => ({ ...f, location: validateVehicleLocation(e.target.value) })); }} onBlur={() => { touch("location"); setFieldVal(f => ({ ...f, location: validateVehicleLocation(location) })); }} placeholder="Sucursal" disabled={formLocked} readOnly={formLocked} style={fieldTouch.location && fieldVal.location && !fieldVal.location.ok ? { borderColor: COLORS.pink } : fieldVal.location?.ok ? { borderColor: COLORS.cyan } : {}} />
              </div>
              {fieldTouch.location && fieldVal.location && !fieldVal.location.ok && <span style={{ fontSize: "0.7rem", color: COLORS.pink, marginLeft: 36 }}>{fieldVal.location.message}</span>}
            </div>

            <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="field-icon active">
                  <svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="currentColor"/></svg>
                </span>
                <input className="field-input-2" value={applicant} onChange={e => { setApplicant(e.target.value); if (fieldTouch.applicant) setFieldVal(f => ({ ...f, applicant: validateVehicleApplicant(e.target.value) })); }} onBlur={() => { touch("applicant"); setFieldVal(f => ({ ...f, applicant: validateVehicleApplicant(applicant) })); }} placeholder="Aspirante" disabled={formLocked} readOnly={formLocked} style={fieldTouch.applicant && fieldVal.applicant && !fieldVal.applicant.ok ? { borderColor: COLORS.pink } : fieldVal.applicant?.ok ? { borderColor: COLORS.cyan } : {}} />
              </div>
              {fieldTouch.applicant && fieldVal.applicant && !fieldVal.applicant.ok && <span style={{ fontSize: "0.7rem", color: COLORS.pink, marginLeft: 36 }}>{fieldVal.applicant.message}</span>}
            </div>

            <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="field-icon active">
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path d="M9 7h6m-6 4h6m-6 4h4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                </span>
                <input className="field-input-2" value={year} onChange={e => { setYear(e.target.value); if (fieldTouch.year) setFieldVal(f => ({ ...f, year: validateYear(e.target.value) })); }} onBlur={() => { touch("year"); setFieldVal(f => ({ ...f, year: validateYear(year) })); }} placeholder="Año" disabled={formLocked} readOnly={formLocked} style={fieldTouch.year && fieldVal.year && !fieldVal.year.ok ? { borderColor: COLORS.pink } : fieldVal.year?.ok ? { borderColor: COLORS.cyan } : {}} />
              </div>
              {fieldTouch.year && fieldVal.year && !fieldVal.year.ok && <span style={{ fontSize: "0.7rem", color: COLORS.pink, marginLeft: 36 }}>{fieldVal.year.message}</span>}
            </div>
            <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="field-icon active">
                  <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path d="M12 2v20m10-10H2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                </span>
                <input className="field-input-2" value={price} onChange={e => { setPrice(e.target.value); if (fieldTouch.price) setFieldVal(f => ({ ...f, price: validatePrice(e.target.value) })); }} onBlur={() => { touch("price"); setFieldVal(f => ({ ...f, price: validatePrice(price) })); }} placeholder="Precio" disabled={formLocked} readOnly={formLocked} style={fieldTouch.price && fieldVal.price && !fieldVal.price.ok ? { borderColor: COLORS.pink } : fieldVal.price?.ok ? { borderColor: COLORS.cyan } : {}} />
              </div>
              {fieldTouch.price && fieldVal.price && !fieldVal.price.ok && <span style={{ fontSize: "0.7rem", color: COLORS.pink, marginLeft: 36 }}>{fieldVal.price.message}</span>}
            </div>
            <div className="field-row">
              <span className="field-icon active">
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              </span>
              <input className="field-input-2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" disabled={formLocked} readOnly={formLocked} />
            </div>

            <div className="card-actions">
              {cardState === 1 && !formLocked && (
                <>
                  <button className="btn-ghost" onClick={resetForm}>Cancelar</button>
                  <button className="btn-outline" onClick={handleCreate} style={{ padding: "9px 22px", fontSize: "0.88rem" }}>Crear</button>
                </>
              )}
              {cardState === 2 && (
                <>
                  <button className="btn-icon-cancel" onClick={resetForm} title="Cancelar" style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <img src="/assets/exclude-1.svg" alt="Cancelar" style={{ width: 20, height: 20 }} />
                  </button>
                  <button className="btn-icon-confirm" onClick={handleUpdate} title="Confirmar" style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <img src="/assets/exclude.svg" alt="Confirmar" style={{ width: 20, height: 20 }} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <svg viewBox="0 0 160 48" width="160" height="48">
            <image href="/assets/frame-logo.svg" x="0" y="0" width="160" height="48" />
          </svg>
        </div>
      </div>

      <div className="dashboard-right">
        {loading ? (
          <p style={{ color: COLORS.grey3, textAlign: "center", padding: "2rem" }}>Cargando...</p>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem", border: `2px dashed ${COLORS.border}`, borderRadius: 20 }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚗</div>
            <h3 style={{ color: COLORS.navy, fontSize: "1.2rem", marginBottom: 8 }}>No hay vehículos registrados</h3>
            <p style={{ color: COLORS.grey3, fontSize: "0.9rem", marginBottom: 16 }}>
              {isAdmin ? "Comienza agregando tu primer vehículo." : "No hay vehículos disponibles."}
            </p>
            {isAdmin && <button className="btn-outline" onClick={openCreate}>+ Crear primer vehículo</button>}
          </div>
        ) : (
          <div className="table-panel">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Sucursal</th>
                    <th>Aspirante</th>
                    <th>Año</th>
                    <th>Precio</th>
                    <th className="col-description">Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const isEditing = editingId === v.id;
                    const isDeleting = deletingId === v.id;
                    return (
                      <tr key={v.id} className={`table-row${isDeleting ? " deleting" : ""}`} style={isEditing ? { background: "#fff8fd" } : {}}>
                        <td>{v.brand}</td>
                        <td>{v.location}</td>
                        <td>{v.applicant}</td>
                        <td>{v.year || "—"}</td>
                        <td>{v.price ? `$${(v.price / 1000000).toFixed(1)}M` : "—"}</td>
                        <td className="col-description" title={v.description || undefined}>
                          <span className="cell-truncate">{v.description || "—"}</span>
                        </td>
                        <td>
                          <div className="row-actions">
                            {isAdmin && (
                              <>
                                <button className="btn-edit" onClick={() => openEdit(v)} title="Editar" style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <img src="/assets/listos-1.svg" alt="Editar" style={{ width: 18, height: 18 }} />
                                </button>
                                <button className="btn-delete" onClick={() => setDeleteTarget(v.id)} title="Eliminar" style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <img src="/assets/exclude-1.svg" alt="Eliminar" style={{ width: 18, height: 18 }} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {total > PAGE_SIZE && (
              <nav className="pagination" aria-label="Paginación de vehículos">
                <span className="pagination-info">
                  {rangeStart}–{rangeEnd} de {total}
                </span>
                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page <= 1 || loading}
                    aria-label="Página anterior"
                  >
                    ←
                  </button>
                  <span className="pagination-label">
                    Página <strong>{page}</strong> de {totalPages}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= totalPages || loading}
                    aria-label="Página siguiente"
                  >
                    →
                  </button>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>

      {/* Delete modal */}
      <div className={`modal-overlay${deleteTarget ? " open" : ""}`}>
        <div className="modal-box">
          <div className="modal-title">¿Eliminar registro?</div>
          <p className="modal-sub">Esta acción no se puede deshacer.</p>
          <div className="modal-btns">
            <button className="modal-btn-cancel" onClick={() => setDeleteTarget(null)} style={{ padding: "10px 28px", border: "1.5px solid #ccc", borderRadius: 30, background: "transparent", color: "#888", fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
            <button className="modal-btn-delete" onClick={handleDelete} style={{ padding: "10px 28px", border: "none", borderRadius: 30, background: COLORS.pink, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Eliminar</button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div id="toast" className={toast ? "show" : ""}>{toast}</div>
    </div>
  );
}
