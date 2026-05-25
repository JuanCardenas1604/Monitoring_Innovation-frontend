import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Stage = "iso" | "gradient" | "welcome";

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("iso");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("gradient"), 1400);
    const t2 = setTimeout(() => setStage("welcome"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => navigate(user ? "/dashboard" : "/login", { replace: true }), 380);
  };

  if (stage === "iso") {
    return (
      <div className={`m-splash welcome${fadeOut ? " fade-out" : ""}`}>
        <img src="/assets/vector-logo.svg" alt="Monitoring Innovation" className="m-splash-iso" />
      </div>
    );
  }

  if (stage === "gradient") {
    return (
      <div className={`m-splash gradient${fadeOut ? " fade-out" : ""}`}>
        <div className="m-motion-logo white">motion</div>
      </div>
    );
  }

  return (
    <div className={`m-splash welcome${fadeOut ? " fade-out" : ""}`}>
      <div>
        <div className="m-splash-tagline">App de ventas</div>
        <div className="m-splash-title">Autos de lujo</div>
      </div>
      <div className="m-motion-logo">motion</div>
      <button type="button" className="m-splash-btn" onClick={handleStart}>
        ¡ Iniciar ¡
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
          <path d="M21 5v14" />
        </svg>
      </button>
    </div>
  );
}
