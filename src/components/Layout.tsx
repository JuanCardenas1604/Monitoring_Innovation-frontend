import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  if (!user) return null;

  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main style={{ paddingTop: isAuthPage ? 0 : "52px" }}>
        <Outlet />
      </main>
    </div>
  );
}
