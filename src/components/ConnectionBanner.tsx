import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConnection } from "../hooks/useConnection";
import { pingHealth } from "../api/client";

const PING_INTERVAL_MS = 10_000;

export default function ConnectionBanner() {
  const { online, apiUp } = useConnection();
  const [checking, setChecking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const problem: "offline" | "api" | null = !online ? "offline" : !apiUp ? "api" : null;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (problem === "api" && online) {
      timerRef.current = setInterval(() => {
        pingHealth();
      }, PING_INTERVAL_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [problem, online]);

  useEffect(() => {
    if (online && !apiUp) {
      pingHealth();
    }
  }, [online, apiUp]);

  const handleRetry = async () => {
    if (checking) return;
    setChecking(true);
    try {
      await pingHealth();
    } finally {
      setTimeout(() => setChecking(false), 400);
    }
  };

  const isOffline = problem === "offline";
  const colors = isOffline
    ? { bg: "#C6007E", text: "#fff" }
    : { bg: "#FB8C00", text: "#fff" };

  return (
    <AnimatePresence>
      {problem && (
        <motion.div
          key={problem}
          role="status"
          aria-live="polite"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            background: colors.bg,
            color: colors.text,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "var(--font)",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
            flexWrap: "wrap",
          }}
        >
          <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
            {isOffline ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1l22 22" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <path d="M12 20h.01" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="12" y1="7" x2="12" y2="11" />
                <circle cx="12" cy="13.5" r="0.6" fill="currentColor" />
              </svg>
            )}
          </span>
          <span>
            {isOffline
              ? "Sin conexión a internet. Revisa tu red e inténtalo de nuevo."
              : "No podemos conectarnos al servidor. Reintentando…"}
          </span>
          {!isOffline && (
            <button
              type="button"
              onClick={handleRetry}
              disabled={checking}
              style={{
                marginLeft: 4,
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.55)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: 14,
                cursor: checking ? "wait" : "pointer",
                fontWeight: 700,
                fontSize: "0.78rem",
                opacity: checking ? 0.7 : 1,
                transition: "background 0.18s",
              }}
            >
              {checking ? "Comprobando…" : "Reintentar"}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
