import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";

import HomeDashboard from "pages/HomeDashboard";
import { AppLayout } from "@app/ui/AppLayout";
import { useSession } from "features/auth/useSession";

function App() {
  const { initSession, status } = useSession();

  useEffect(() => {
    initSession(); // Recupera sesión al cargar la app
  }, [initSession]);

  // Opcional: Mostrar loading mientras se verifica la sesión
  if (status === "unknown") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomeDashboard />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;