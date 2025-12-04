// app/ui/UserNavbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";
import { useCart, type CartItem } from "features/auth/useCart";

interface UserNavbarProps {
  isStaff?: boolean;
}

export function UserNavbar({ isStaff = false }: UserNavbarProps) {
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const { items, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const [showCart, setShowCart] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCheckout = () => {
    if (!user) {
      alert("Por favor inicia sesión para realizar tu pedido");
      setShowCart(false);
      navigate("/login");
      return;
    }
    setShowCart(false);
    navigate("/checkout");
  };

  const getRoleBadge = () => {
    const roleColors = {
      COCINERO: "bg-orange-100 text-orange-700 border-orange-300",
      DESPACHADOR: "bg-blue-100 text-blue-700 border-blue-300",
      REPARTIDOR: "bg-green-100 text-green-700 border-green-300",
      USUARIO: "bg-purple-100 text-purple-700 border-purple-300",
    };

    const roleIcons = {
      COCINERO: "👨‍🍳",
      DESPACHADOR: "📦",
      REPARTIDOR: "🛵",
      USUARIO: "👤",
    };

    const rol = user?.rol || "USUARIO";
    const colorClass =
      roleColors[rol as keyof typeof roleColors] || roleColors.USUARIO;
    const icon =
      roleIcons[rol as keyof typeof roleIcons] || roleIcons.USUARIO;

    return (
      <span
        className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${colorClass}`}
      >
        {icon} {rol}
      </span>
    );
  };

  return (
    <>
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
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/productos"
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
              >
                <span className="text-xl">🍜</span>
                <span>Menú</span>
              </Link>

              {isStaff && (
                <button
                  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
                  onClick={() => navigate("/mis-pedidos")}
                >
                  <span className="text-xl">📋</span>
                  <span>Mis Tareas</span>
                </button>
              )}

              <button
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
                onClick={() => navigate("/promos")}
              >
                <span className="text-xl">🧧</span>
                <span>Promos</span>
              </button>

              <button
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors font-medium"
                onClick={() => navigate("/locales")}
              >
                <span className="text-xl">📍</span>
                <span>Locales</span>
              </button>
            </div>

            {/* Lado derecho */}
            <div className="flex items-center gap-4">
              {/* Teléfono */}
              <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-5 py-2.5 border border-white/20">
                <span className="text-2xl">📞</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-white/80 text-xs font-medium">Llámanos</span>
                  <span className="text-yellow-300 font-bold text-lg tracking-wide">
                    01-612-8000
                  </span>
                </div>
              </div>

              {/* Usuario info */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/20">
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-white/80 text-xs">Hola,</span>
                  <span className="text-yellow-300 font-bold text-sm">
                    {user?.nombre || user?.correo}
                  </span>
                </div>
                {getRoleBadge()}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-300 font-medium text-sm transition-colors"
                >
                  🚪
                </button>
              </div>

              {/* BOTÓN CARRITO - Solo para usuarios normales */}
              {!isStaff && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-red-700 rounded-full px-5 py-2.5 font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  <span className="text-xl">🛒</span>
                  <span>S/ {getTotal().toFixed(2)}</span>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center animate-bounce">
                      {getItemCount()}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 🔻 Sub-barra de navegación: seguir / historial de pedidos */}
        <div className="w-full bg-red-700/95 border-t border-red-500/60">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-2 flex justify-end gap-6 text-[12px] text-yellow-100">
            {isStaff ? (
              <>
                <button
                  onClick={() => navigate("/mis-pedidos")}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>📋</span>
                  <span>Pedidos activos</span>
                </button>
                <button
                  onClick={() => navigate("/mis-pedidos")}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>✅</span>
                  <span>Completados</span>
                </button>
              </>
            ) : (
              <>

                <button
                  onClick={() => navigate("/mis-pedidos")}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>📄</span>
                  <span>Historial de pedidos</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Barra decorativa con patrón chino */}
        <div className="w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
      </nav>

      {/* MODAL CARRITO */}
      {showCart && !isStaff && (
        <CartModal
          items={items}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
          getTotal={getTotal}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}

// ========== CART MODAL ==========
interface CartModalProps {
  items: CartItem[];
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  onClose: () => void;
  onCheckout: () => void;
}

function CartModal({
  items,
  updateQuantity,
  clearCart,
  getTotal,
  onClose,
  onCheckout,
}: CartModalProps) {
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 transform animate-[scale-in_0.3s_ease-out]">
          <div className="text-center">
            <p className="text-6xl mb-4 animate-bounce">🛒</p>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-6">
              ¡Agrega deliciosos platillos para continuar!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all shadow-lg"
            >
              Explorar Menú 🍜
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transform animate-[scale-in_0.3s_ease-out]">
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🛒 Tu Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-300 text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.product_id}
                className="flex gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <img
                  src={
                    item.product.imageUrl ||
                    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover shadow-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold text
-base mb-1 text-gray-800">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    S/ {item.product.price.toFixed(2)} c/u
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.product_id,
                          item.quantity - 1
                        )
                      }
                      className="h-8 w-8 rounded-full bg-gray-100 border-2 border-red-500 text-red-500 flex items-center justify-center font-bold hover:bg-red-50 transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold text-lg w-8 text-center text-red-600">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.product_id,
                          item.quantity + 1
                        )
                      }
                      className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 transition-colors shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="font-bold text-lg text-red-600">
                    S/ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => updateQuantity(item.product.product_id, 0)}
                    className="text-red-600 text-sm hover:text-red-800 font-medium hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-gray-200 px-6 py-5 bg-white">
          <div className="flex justify-between items-center mb-5">
            <span className="text-xl font-bold text-gray-700">Total:</span>
            <span className="text-3xl font-bold text-red-600">
              S/ {getTotal().toFixed(2)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (confirm("¿Vaciar todo el carrito?")) {
                  clearCart();
                }
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              🗑️ Vaciar
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all shadow-lg"
            >
              💳 Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
