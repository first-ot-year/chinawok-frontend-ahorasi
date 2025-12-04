// ==================== app/ui/UserNavbar.tsx ====================
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

interface UserNavbarProps {
  isStaff?: boolean;
}

export function UserNavbar({ isStaff = false }: UserNavbarProps) {
  const { user, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleBadge = () => {
    const roleColors = {
      COCINERO: "bg-orange-100 text-orange-700",
      DESPACHADOR: "bg-blue-100 text-blue-700",
      REPARTIDOR: "bg-green-100 text-green-700",
      USUARIO: "bg-gray-100 text-gray-700",
    };

    const roleIcons = {
      COCINERO: "👨‍🍳",
      DESPACHADOR: "📦",
      REPARTIDOR: "🛵",
      USUARIO: "👤",
    };

    const rol = user?.rol || "USUARIO";
    const colorClass = roleColors[rol as keyof typeof roleColors] || roleColors.USUARIO;
    const icon = roleIcons[rol as keyof typeof roleIcons] || roleIcons.USUARIO;

    return (
      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${colorClass}`}>
        {icon} {rol}
      </span>
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="w-full bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">
          {/* Logo + menú */}
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
              {isStaff && (
                <button className="flex items-center gap-1 hover:text-red-600">
                  <span>📋</span>
                  <span>Mis Tareas</span>
                </button>
              )}
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>🧧</span>
                <span>Promos</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>📍</span>
                <span>Locales</span>
              </button>
            </div>
          </div>

          {/* Lado derecho */}
          <div className="flex items-center gap-6 text-xs md:text-sm">
            <div className="hidden md:flex flex-col items-start leading-tight">
              <div className="flex items-center gap-2 text-gray-500">
                <span>📞</span>
                <span>Llámanos</span>
              </div>
              <span className="text-green-600 font-semibold">
                01 - 612 - 8000
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start leading-tight">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs">Hola,</span>
                  <span className="text-green-600 font-semibold">
                    {user?.nombre || user?.correo}
                  </span>
                </div>
                {getRoleBadge()}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Cerrar sesión
              </button>
            </div>

            {!isStaff && (
              <button className="flex items-center gap-2 bg-green-600 text-white rounded-full px-4 py-2 text-xs md:text-sm font-semibold">
                <span>🛒</span>
                <span>S/ 0.00</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fila inferior */}
      <div className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex justify-end gap-6 text-[12px] text-gray-500">
          {isStaff ? (
            <>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>📋</span>
                <span>Pedidos Activos</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>✅</span>
                <span>Completados</span>
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>♡</span>
                <span>Mis Favoritos</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>🕒</span>
                <span>Sigue tu pedido</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>📄</span>
                <span>Mis Pedidos</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}