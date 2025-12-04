import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import HomePage from "pages/HomePage";
import ProductsPage from "pages/ProductPage";
import AdminProductsPage from "pages/AdminPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailPage from "pages/OrderDetailPage";
import { AppLayout } from "@app/ui/AppLayout";
import { useSession } from "features/auth/useSession";
import AdminOrdersPage from "./pages/AdminOrdersPage";

// Componente para proteger rutas de admin
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  
  // Si no hay usuario o no es ADMIN, redirigir al login
  if (!user || user.rol !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

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
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orden/:orderId" element={<OrderDetailPage />} />
          <Route path="/seguir-pedido" element={<TrackOrderPage />} />
<Route path="/mis-pedidos" element={<MyOrdersPage />} />
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas de Administrador (Protegidas) */}
          <Route 
            path="/admin/productos" 
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            } 
          />

          {/* Ruta 404 - Opcional */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;