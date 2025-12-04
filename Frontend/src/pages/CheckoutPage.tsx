import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, type CartItem } from "../features/auth/useCart";
import { useSession } from "../features/auth/useSession";
import { createOrder } from "../features/auth/api";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useSession();

  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    reference: "",
    phone: "",
    paymentMethod: "efectivo",
    notes: "",
  });

  // Redirigir si no hay items o no hay usuario
  React.useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
    if (!user) {
      navigate("/login");
    }
  }, [items, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para realizar un pedido");
      navigate("/login");
      return;
    }

    if (!deliveryInfo.address || !deliveryInfo.phone) {
      alert("Por favor completa la dirección y teléfono");
      return;
    }

    try {
      setLoading(true);

      // Preparar items para el pedido
const orderItems = items.map((item) => ({
  product_id: item.product.product_id,
  quantity: item.quantity,
  price: item.product.price,
  name: item.product.name,
  imageUrl: item.product.imageUrl,
}));

      // Crear pedido
      const response = await createOrder({
  customer_id: user.user_id,
  items: orderItems,
});

console.log("Pedido creado:", response);

const orderId = response.data.order_id;

alert(
  `¡Pedido realizado con éxito! 🎉\n\nNúmero de pedido: ${
    orderId || "N/A"
  }\n\nEn breve recibirás la confirmación.`
);

      console.log("Pedido creado:", response);

      // Limpiar carrito
      clearCart();

      // Mostrar mensaje de éxito
      alert(
        `¡Pedido realizado con éxito! 🎉\n\nNúmero de pedido: ${response.order_id || "N/A"}\n\nEn breve recibirás la confirmación.`
      );

      // Redirigir a página de seguimiento o home
      navigate("/");
    } catch (error: any) {
      console.error("Error al crear pedido:", error);
      alert(
        error.response?.data?.error ||
          "Error al procesar el pedido. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 5.0;
  const subtotal = getTotal();
  const total = subtotal + deliveryFee;

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Volver al menú
        </button>

        <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* FORMULARIO */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información de entrega */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Información de Entrega</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección de entrega *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryInfo.address}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Av. Ejemplo 123, Miraflores"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia (opcional)
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.reference}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, reference: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="Edificio verde, segundo piso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      value={deliveryInfo.phone}
                      onChange={(e) =>
                        setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="999 888 777"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Método de Pago</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="efectivo"
                      checked={deliveryInfo.paymentMethod === "efectivo"}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="h-4 w-4 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">💵 Efectivo</p>
                      <p className="text-sm text-gray-600">
                        Paga al recibir tu pedido
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="yape"
                      checked={deliveryInfo.paymentMethod === "yape"}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="h-4 w-4 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">💜 Yape / Plin</p>
                      <p className="text-sm text-gray-600">
                        Transferencia bancaria
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-600 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="tarjeta"
                      checked={deliveryInfo.paymentMethod === "tarjeta"}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="h-4 w-4 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">💳 Tarjeta</p>
                      <p className="text-sm text-gray-600">
                        Visa, Mastercard, AMEX
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notas adicionales */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-xl font-bold mb-4">Notas Adicionales</h2>
                <textarea
                  value={deliveryInfo.notes}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="Instrucciones especiales para tu pedido..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Procesando..." : `Confirmar Pedido - S/ ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* RESUMEN */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-4">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

              <div className="space-y-3 mb-4">
  {items.map((item: CartItem) => (
    <div
      key={item.product.product_id}
      className="flex justify-between text-sm"
    >
      <span className="text-gray-700">
        {item.quantity}x {item.product.name}
      </span>
      <span className="font-semibold">
        S/ {(item.product.price * item.quantity).toFixed(2)}
      </span>
    </div>
  ))}
</div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Delivery</span>
                  <span className="font-semibold">S/ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-green-600">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  🚚 Tiempo estimado de entrega: 30-45 minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;