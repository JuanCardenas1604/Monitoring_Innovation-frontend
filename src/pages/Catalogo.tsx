import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { vehiclesApi } from "../api/vehicles";
import type { Vehicle } from "../types";
import { useIsMobile } from "../hooks/useIsMobile";
import MobileShell from "../components/mobile/MobileShell";
import { COLORS } from "../utils/constants";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=70",
];

function imageFor(_v: Vehicle, idx: number): string {
  return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
}

export default function Catalogo() {
  const isMobile = useIsMobile();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const data = await vehiclesApi.list({ skip: 0, limit: 50 });
        setVehicles(data.items);
      } catch { /* api interceptor handles */ }
      finally { setLoading(false); }
    })();
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const items = useMemo(() => vehicles.map((v, i) => ({ ...v, img: imageFor(v, i) })), [vehicles]);

  const Cards = (
    <div className="m-catalog">
      {loading ? (
        <p style={{ textAlign: "center", color: COLORS.grey3, padding: "2rem" }}>Cargando catálogo...</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: "center", color: COLORS.grey3, padding: "2rem 1rem", fontSize: "0.9rem" }}>
          Aún no hay vehículos en el catálogo.
        </p>
      ) : (
        items.map((v, idx) => {
          const isSel = selected.has(v.id);
          return (
            <motion.article
              key={v.id}
              className="m-catcard"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <img className="m-catcard-img" src={v.img} alt={`${v.brand} ${v.location}`} loading="lazy" />
              <div className="m-catcard-foot">
                <div className="m-catcard-name">{v.brand}</div>
                <button
                  className={`m-catcard-check${isSel ? " active" : ""}`}
                  type="button"
                  onClick={() => toggle(v.id)}
                  aria-pressed={isSel}
                  aria-label={isSel ? "Deseleccionar" : "Seleccionar"}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                </button>
              </div>
            </motion.article>
          );
        })
      )}
    </div>
  );

  if (isMobile) {
    return (
      <MobileShell title="catálogo">
        {Cards}
      </MobileShell>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: "32px auto", padding: "0 24px" }}>
      <h1 style={{ color: COLORS.navy, fontWeight: 800, marginBottom: 24 }}>Catálogo de vehículos</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
        {loading ? (
          <p style={{ color: COLORS.grey3 }}>Cargando...</p>
        ) : items.length === 0 ? (
          <p style={{ color: COLORS.grey3 }}>Aún no hay vehículos en el catálogo.</p>
        ) : (
          items.map((v) => {
            const isSel = selected.has(v.id);
            return (
              <article key={v.id} className="m-catcard" style={{ borderRadius: 18 }}>
                <img className="m-catcard-img" src={v.img} alt={`${v.brand} ${v.location}`} loading="lazy" />
                <div className="m-catcard-foot">
                  <div className="m-catcard-name">{v.brand}</div>
                  <button className={`m-catcard-check${isSel ? " active" : ""}`} onClick={() => toggle(v.id)} aria-pressed={isSel}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
