// app/ui/AppNavbar.tsx
import { useEffect } from "react";
import { useSession } from "features/auth/useSession";
import { GuideNavbar } from "./PublicNavbar";
import { TouristNavbar } from "./TouristNavbar";


export function AppNavbar() {
  const { status, me, user } = useSession();

  useEffect(() => {
    if (status === "unknown") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        me();
      }
    }
  }, [status, me]);

  if (status !== "authenticated") {
    return <GuideNavbar />;
  }

  // Si es guía
  if (user?.role === "guide") {
    return <GuideNavbar />;
  }

  // Por defecto, turista
  return <GuideNavbar />;
}
