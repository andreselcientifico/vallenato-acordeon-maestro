// src/components/AdminRoute.tsx

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/api/auth";

/**
 * 🔐 AdminRoute
 * Envuelve páginas que solo deben ser accesibles por usuarios con rol "Admin".
 *
 * ✔ Verifica el usuario actual llamando a /users/me
 * ✔ Si hay errores (CORS, red caída, cookie inválida, sin token):
 *      → trata al usuario como NO logueado
 * ✔ No rompe la UI ante fallos de red o backend
 *
 * Flujo:
 * 1. Cargando…
 * 2. No logueado → redirige al inicio
 * 3. Logueado pero sin permisos → redirige a perfil
 * 4. Admin → Renderiza children
 */
export default function AdminRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      const u = await getCurrentUser();
      if (mounted) setUser(u);
    } catch (err: any) {
      // Si el backend no responde → estado error
      if (err?.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Error validando sesión:", err);
        setUser("ERROR" as any);
      }
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);


  // ===============================
  // 🌀 ESTADO DE CARGA
  // ===============================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="text-lg text-muted-foreground">Verificando permisos…</p>
      </div>
    );
  }

  // ===============================
  // 🚪 NO LOGUEADO
  // ===============================
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ===============================
  // ⛔ LOGUEADO PERO NO ES ADMIN
  // ===============================
  if (user.role !== "Admin") {
    return <Navigate to="/perfil" replace />;
  }

  if (user === "ERROR") {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500">
        No se pudo verificar la sesión. Intenta recargar.
      </p>
    </div>
  );
}
  // ===============================
  // 🎉 PERMITIDO
  // ===============================
  return children;
}
