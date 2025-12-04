// ==================== app/ui/AppNavbar.tsx ====================
import { useEffect } from "react";
import { useSession } from "features/auth/useSession";
import { PublicNavbar } from "./PublicNavbar";
import { AdminNavbar } from "./AdminNavbar";
import { UserNavbar } from "./UserNavbar";

export function AppNavbar() {
  const { status, initSession, user } = useSession();

useEffect(() => {
  if (status === "unknown") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      initSession();
    }
  }
}, [status, initSession]);

  // Si no está autenticado, mostrar navbar público
  if (status !== "authenticated" || !user) {
    return <PublicNavbar />;
  }

  // Si es ADMIN, mostrar navbar de admin
  if (user.rol === "ADMIN") {
    return <AdminNavbar />;
  }

  // Si es COCINERO, DESPACHADOR o REPARTIDOR, mostrar navbar de staff
  if (["COCINERO", "DESPACHADOR", "REPARTIDOR"].includes(user.rol)) {
    return <UserNavbar isStaff={true} />;
  }

  // Por defecto, USUARIO normal
  return <UserNavbar isStaff={false} />;
}





