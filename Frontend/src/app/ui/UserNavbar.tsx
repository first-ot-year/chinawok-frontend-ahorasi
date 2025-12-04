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
    const colorClass =
      roleColors[rol as keyof typeof roleColors] || roleColors.USUARIO;
    const icon =
      roleIcons[rol as keyof typeof roleIcons] || roleIcons.USUARIO;

    return (
      <span
        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${colorClass}`}
      >
        {icon} {rol}
      </span>
    );
  };

  return (
    <>
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
                <Link
                  to="/productos"
                  className="flex items-center gap-1 hover:text-red-600"
                >
                  <span>🍽️</span>
                  <span>Menú</span>
                </Link>

                {isStaff && (
                  <button
                    className="flex items-center gap-1 hover:text-red-600"
                    onClick={() => navigate("/mis-pedidos")}
                  >
                    <span>📋</span>
                    <span>Mis Tareas</span>
                  </button>
                )}

                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/promos")}
                >
                  <span>🧧</span>
                  <span>Promos</span>
                </button>

                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/locales")}
                >
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

              {/* BOTÓN CARRITO - Solo para usuarios normales */}
              {!isStaff && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative flex items-center gap-2 bg-green-600 text-white rounded-full px-4 py-2 text-xs md:text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  <span>🛒</span>
                  <span>S/ {getTotal().toFixed(2)}</span>
                  {getItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
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
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/staff/pedidos-activos")}
                >
                  <span>📋</span>
                  <span>Pedidos Activos</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/staff/pedidos-completados")}
                >
                  <span>✅</span>
                  <span>Completados</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/favoritos")}
                >
                  <span>♡</span>
                  <span>Mis Favoritos</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/seguir-pedido")}
                >
                  <span>🕒</span>
                  <span>Sigue tu pedido</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-red-600"
                  onClick={() => navigate("/mis-pedidos")}
                >
                  <span>📄</span>
                  <span>Mis Pedidos</span>
                </button>
              </>
            )}
          </div>
        </div>
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
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <p className="text-6xl mb-4">🛒</p>
            <h3 className="text-xl font-bold mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-6">
              Agrega productos para continuar
            </p>
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Tu Pedido</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.product_id}
                className="flex gap-4 bg-gray-50 p-4 rounded-lg"
              >
                <img
                  src={
                    item.product.imageUrl ||
                    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    S/ {item.product.price.toFixed(2)} c/u
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.product_id,
                          item.quantity - 1
                        )
                      }
                      className="h-8 w-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.product_id,
                          item.quantity + 1
                        )
                      }
                      className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    S/ {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => updateQuantity(item.product.product_id, 0)}
                    className="text-red-600 text-sm hover:underline mt-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
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
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100"
            >
              Vaciar carrito
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}