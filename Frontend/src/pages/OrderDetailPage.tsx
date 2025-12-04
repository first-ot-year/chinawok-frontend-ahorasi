// src/pages/OrderDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSession } from "../features/auth/useSession";
import { getOrdersByCustomer, type Order } from "../features/auth/api";

type LocationState = {
  order?: Order;
};

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Orden recibida",
  COCINANDO: "En cocina",
  EMPACANDO: "Empacando",
  EN_REPARTO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const STATUS_STEPS = [
  { code: "PENDIENTE", label: "Orden recibida" },
  { code: "COCINANDO", label: "En cocina" },
  { code: "EMPACANDO", label: "Empacando" },
  { code: "EN_REPARTO", label: "En camino" },
  { code: "ENTREGADO", label: "Entregado" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "COCINANDO":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "EMPACANDO":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "EN_REPARTO":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "ENTREGADO":
      return "bg-green-100 text-green-800 border-green-300";
    case "CANCELADO":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSession();

  const state = location.state as LocationState | undefined;

  const [order, setOrder] = useState<Order | null>(state?.order ?? null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState<string | null>(null);

  // Cargar pedido si no vino por state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId || state?.order) return;

      try {
        setLoading(true);
        setError(null);

        const resp = await getOrdersByCustomer(user.user_id);
        // backend: { success: boolean; data: Order[] }
        const orders: Order[] = resp.data || [];

        const found = orders.find((o) => o.order_id === orderId);
        if (!found) {
          setError("No se encontró la orden.");
        } else {
          setOrder(found);
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la orden.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId, state?.order]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold">Inicia sesión para ver tus órdenes</h1>
          <p className="text-gray-600 text-sm">
            Debes estar autenticado para ver el detalle de tu pedido.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-sm w-full text-center">
          <p className="text-gray-600">Cargando detalle de la orden...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-red-600">No se pudo cargar la orden</h1>
          <p className="text-gray-600 text-sm">{error || "Intenta nuevamente más tarde."}</p>
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-black"
          >
            Volver a mis órdenes
          </button>
        </div>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[order.status] || order.status;
  const statusColor = getStatusColor(order.status);

  // Determinar paso actual para la barra de progreso
  const currentStepIndex =
    STATUS_STEPS.findIndex((s) => s.code === order.status) === -1
      ? 0
      : STATUS_STEPS.findIndex((s) => s.code === order.status);

  const createdDate = new Date(order.created_at);
  const formattedDate = createdDate.toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver a mis órdenes
          </button>
          <span className="text-xs text-gray-500">
            Cliente: <span className="font-semibold">{user.correo}</span>
          </span>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
          {/* Encabezado de la orden */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Seguimiento de tu orden
              </h1>
              <p className="text-sm text-gray-500">
                Código de seguimiento:{" "}
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {order.order_id.slice(0, 8).toUpperCase()}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Realizada el {formattedDate}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
              >
                Estado: {statusLabel}
              </span>
              <p className="text-lg font-bold text-green-600">
                Total: S/ {order.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Progreso de la orden */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Progreso de la orden
            </h2>
            <div className="flex items-center justify-between gap-2">
              {STATUS_STEPS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isLast = index === STATUS_STEPS.length - 1;

                return (
                  <div key={step.code} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center text-center flex-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold 
                          ${
                            isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                      >
                        {index + 1}
                      </div>
                      <p
                        className={`mt-1 text-[11px] md:text-xs ${
                          isCompleted ? "text-gray-800" : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div
                        className={`h-0.5 flex-1 mx-1 md:mx-2 ${
                          index < currentStepIndex
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Detalle de productos */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Detalle de tu pedido
              </h2>

              <div className="space-y-3">
                {order.items.map((item) => {
                  // Cast suave para permitir name / imageUrl
                  const anyItem = item as any;
                  const name = anyItem.name || anyItem.product_name || item.product_id;
                  const imageUrl =
                    anyItem.imageUrl ||
                    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800";

                  return (
                    <div
                      key={item.product_id + String(anyItem.name || "")}
                      className="flex gap-4 bg-gray-50 rounded-xl p-3 md:p-4"
                    >
                      <img
                        src={imageUrl}
                        alt={name}
                        className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {name}
                          </p>
                          {anyItem.category && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {anyItem.category}
                            </p>
                          )}
                          {anyItem.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {anyItem.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Cantidad:{" "}
                            <span className="font-semibold">
                              {Number(item.quantity)}
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-gray-800">
                            S/ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resumen */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Resumen de pago
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>
                  {/* Si luego tienes deliveryFee / descuentos, agrégalo aquí */}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total pagado</span>
                    <span className="text-green-600">
                      S/ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-green-100 rounded-xl p-4 text-xs text-gray-600 space-y-2">
                <p className="font-semibold text-gray-800">
                  Información importante
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Guarda este código de seguimiento para cualquier consulta.</li>
                  <li>
                    Podrás ver el cambio de estado de tu órden en esta misma
                    pantalla.
                  </li>
                  <li>
                    Si tu órden aparece como <span className="font-semibold">ENTREGADO</span> y no
                    la recibiste, comunícate con el local.
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate("/my-orders")}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-black"
              >
                Volver a mis órdenes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;