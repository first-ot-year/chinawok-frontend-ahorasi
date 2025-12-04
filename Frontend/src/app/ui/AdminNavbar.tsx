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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="w-full bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">
          {/* Logo + menú admin */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-24 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold">
                China Wok
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm text-gray-800">
              <Link to="/productos" className="flex items-center gap-1 hover:text-red-600">
                <span>🍽️</span>
                <span>Menú</span>
              </Link>
              <Link to="/admin/productos" className="flex items-center gap-1 hover:text-red-600 font-semibold">
                <span>⚙️</span>
                <span>Administrar Productos</span>
              </Link>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>📊</span>
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">👤 Admin:</span>
                  <span className="text-green-600 font-semibold">
                    {user?.nombre || user?.correo}
                  </span>
                </div>
                <span className="text-[10px] text-purple-600 font-semibold uppercase">
                  🛡️ Administrador
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fila inferior - Opciones de admin */}
      <div className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex justify-end gap-6 text-[12px] text-gray-500">
          <Link to="/admin/productos" className="flex items-center gap-1 hover:text-red-600">
            <span>📦</span>
            <span>Productos</span>
          </Link>
          <button className="flex items-center gap-1 hover:text-red-600">
            <span>📋</span>
            <span>Pedidos</span>
          </button>
          <button className="flex items-center gap-1 hover:text-red-600">
            <span>👥</span>
            <span>Usuarios</span>
          </button>
          <button className="flex items-center gap-1 hover:text-red-600">
            <span>📊</span>
            <span>Reportes</span>
          </button>
        </div>
      </div>
    </nav>
  );
}