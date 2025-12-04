import { Link, useNavigate } from "react-router-dom";

export function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      {/* Fila superior */}
      <div className="w-full bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-10 py-3">
          {/* Logo + menú */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-24 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold">
                China Wok
              </div>
            </Link>

            {/* Menú principal */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-800">
              <Link to="/productos" className="flex items-center gap-1 hover:text-red-600">
                <span>🍽️</span>
                <span>Menú</span>
              </Link>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>🧧</span>
                <span>Promos exclusivas</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>📍</span>
                <span>Locales</span>
              </button>
              <button className="flex items-center gap-1 hover:text-red-600">
                <span>🔍</span>
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* Lado derecho: teléfono, usuario, carrito */}
          <div className="flex items-center gap-6 text-xs md:text-sm">
            {/* Teléfono */}
            <div className="hidden md:flex flex-col items-start leading-tight">
              <div className="flex items-center gap-2 text-gray-500">
                <span>📞</span>
                <span>Llámanos</span>
              </div>
              <span className="text-green-600 font-semibold">
                01 - 612 - 8000
              </span>
            </div>

            {/* Perfil / login */}
            <div
              className="flex flex-col items-start leading-tight cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <div className="flex items-center gap-2 text-gray-500">
                <span>👤</span>
                <span>Hola,</span>
              </div>
              <span className="text-green-600 font-semibold hover:underline">
                INICIAR SESIÓN
              </span>
            </div>

            {/* Carrito */}
            <button className="flex items-center gap-2 bg-green-600 text-white rounded-full px-4 py-2 text-xs md:text-sm font-semibold">
              <span>🛒</span>
              <span>S/ 0.00</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fila inferior: Mis Favoritos / Sigue tu pedido / Mis Pedidos */}
      <div className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex justify-end gap-6 text-[12px] text-gray-500">
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
        </div>
      </div>
    </nav>
  );
}
