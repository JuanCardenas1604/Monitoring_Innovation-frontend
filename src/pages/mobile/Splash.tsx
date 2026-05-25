import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

type Stage = "iso" | "gradient" | "welcome";

const stageTransition = { duration: 0.55, ease: [0.45, 0, 0.25, 1] as const };

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("iso");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("gradient"), 1500);
    const t2 = setTimeout(() => setStage("welcome"), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleStart = () => {
    setLeaving(true);
    setTimeout(() => navigate(user ? "/dashboard" : "/login", { replace: true }), 520);
  };

  return (
    <AnimatePresence mode="wait">
      {!leaving && stage === "iso" && (
        <motion.div
          key="iso"
          className="m-splash welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={stageTransition}
        >
          <motion.img
            src="/assets/vector-logo.svg"
            alt="Monitoring Innovation"
            className="m-splash-iso"
            initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
          />
        </motion.div>
      )}

      {!leaving && stage === "gradient" && (
        <motion.div
          key="gradient"
          className="m-splash gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={stageTransition}
        >
          <motion.div
            className="m-motion-logo white"
            initial={{ opacity: 0, y: 24, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            motion
          </motion.div>
        </motion.div>
      )}

      {!leaving && stage === "welcome" && (
        <motion.div
          key="welcome"
          className="m-splash welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={stageTransition}
        >
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="m-splash-tagline">App de ventas</div>
            <div className="m-splash-title">Autos de lujo</div>
          </motion.div>

          <motion.div
            className="m-motion-logo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.25, ease: [0.34, 1.4, 0.64, 1] }}
          >
            motion
          </motion.div>

          <motion.button
            type="button"
            className="m-splash-btn"
            onClick={handleStart}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            ¡ Iniciar ¡
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
              <path d="M21 5v14" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {leaving && (
        <motion.div
          key="leaving"
          className="m-splash welcome"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: [0.55, 0, 0.45, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
