import { Link, useNavigate } from "react-router-dom";

export function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Barra principal con degradado rojo chino */}
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
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/productos" 
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
            >
              <span className="text-xl">🍜</span>
              <span>Menú</span>
            </Link>
          </div>

          {/* Lado derecho: teléfono, botones auth y carrito */}
          <div className="flex items-center gap-4">
            {/* Teléfono - destacado */}
            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-5 py-2.5 border border-white/20">
              <span className="text-2xl">📞</span>
              <div className="flex flex-col leading-tight">
                <span className="text-white/80 text-xs font-medium">Llámanos</span>
                <span className="text-yellow-300 font-bold text-lg tracking-wide">
                  940-433-950
                </span>
              </div>
            </div>

            {/* Botones de autenticación */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold border border-white/20 transition-all"
              >
                <span>🔐</span>
                <span className="hidden md:inline">Iniciar Sesión</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-white hover:bg-yellow-50 text-red-600 rounded-full px-4 py-2 text-sm font-bold shadow-md transition-all transform hover:scale-105"
              >
                <span>✨</span>
                <span className="hidden md:inline">Registrarse</span>
              </button>
            </div>

            {/* Carrito */}
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-red-700 rounded-full px-5 py-2.5 font-bold shadow-lg transform hover:scale-105 transition-all">
              <span className="text-xl">🛒</span>
              <span>S/ 0.00</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra decorativa con patrón chino */}
      <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
    </nav>
  );
}