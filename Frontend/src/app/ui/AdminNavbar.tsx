// ==================== app/ui/AdminNavbar.tsx ====================
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export function AdminNavbar() {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Barra principal con degradado rojo */}
      <div className="w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-white rounded-lg px-6 py-2 shadow-md transform group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  China Wok
                </span>
              </div>
            </div>
          </Link>

          {/* Menú principal */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/productos"
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
            >
              <span className="text-xl">🍽️</span>
              <span>Menú</span>
            </Link>

            <Link
              to="/admin/productos"
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-semibold"
            >
              <span className="text-xl">⚙️</span>
              <span>Administrar Productos</span>
            </Link>

            {/* ✅ Dashboard ahora navega a la página de admin que creamos */}
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
            >
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Lado derecho */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/20">
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white/80 text-xs">Hola,</span>
                <span className="text-yellow-300 font-bold text-sm">
                  {user?.nombre || user?.correo}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border bg-purple-100 text-purple-700 border-purple-300">
                🛡️ Administrador
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-300 font-medium text-sm transition-colors"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila inferior - Opciones de admin */}
      <div className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex justify-end gap-6 text-[12px] text-gray-500">
          <Link
            to="/admin/productos"
            className="flex items-center gap-1 hover:text-red-600 transition-colors"
          >
            <span>📦</span>
            <span>Productos</span>
          </Link>
          <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <span>📋</span>
            <span>Pedidos</span>
          </button>
          <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <span>👥</span>
            <span>Usuarios</span>
          </button>
          <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <span>📊</span>
            <span>Reportes</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
