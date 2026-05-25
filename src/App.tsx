import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ConnectionBanner from "./components/ConnectionBanner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import VehicleForm from "./pages/VehicleForm";
import Users from "./pages/Users";
import Catalogo from "./pages/Catalogo";
import Perfil from "./pages/Perfil";
import Splash from "./pages/mobile/Splash";
import { pingHealth } from "./api/client";

export default function App() {
  useEffect(() => {
    pingHealth();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ConnectionBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicles/new" element={<VehicleForm />} />
            <Route path="/vehicles/:id" element={<VehicleForm />} />
            <Route path="/vehicles/:id/edit" element={<VehicleForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
