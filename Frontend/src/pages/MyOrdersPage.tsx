// src/pages/MyOrdersPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../features/auth/useSession";
import { getOrdersByCustomer, type Order } from "../features/auth/api";

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pedido recibido",
  COCINANDO: "En cocina",
  EMPACANDO: "Empacando",
  EN_REPARTO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

function formatOrderCode(orderId: string): string {
  if (!orderId) return "";
  // Tomamos los primeros 6–8 caracteres para un código corto
  const short = orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `CHW-${short}`;
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Fecha no disponible";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const MyOrdersPage: React.FC = () => {
  const { user, status } = useSession();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrdersByCustomer(user.user_id);
        // ms-pedidos devuelve { success: true, data: [...] }
        const list: Order[] = (data as any).data || [];
        setOrders(list);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.error || "No se pudieron cargar tus pedidos."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, status, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Mis pedidos</h1>

        {loading && <p className="text-gray-600">Cargando pedidos...</p>}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-lg border p-6 text-center">
            <p className="text-lg font-semibold mb-2">
              Aún no tienes pedidos registrados
            </p>
            <p className="text-gray-600 mb-4">
              Explora el menú y realiza tu primer pedido.
            </p>
            <button
              onClick={() => navigate("/productos")}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Ver menú
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusLabel =
                STATUS_LABELS[order.status] || order.status || "Desconocido";
              const chipColor =
                order.status === "ENTREGADO"
                  ? "bg-green-100 text-green-700"
                  : order.status === "CANCELADO"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";

              return (
                <div
                  key={order.order_id}
                  className="bg-white rounded-lg border p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    {/* Encabezado más “comercial” */}
            <p className="text-sm font-semibold text-gray-800">
            Orden China Wok · {formatOrderCode(order.order_id)}
            </p>
                    <p className="text-xs text-gray-400 break-all">
                      ID de seguimiento: {order.order_id}
                    </p>
                    

                    <p className="mt-2 text-sm text-gray-500">
                      Realizada el{" "}
                      <span className="font-medium">
                        {formatDate(order.created_at)}
                      </span>
                    </p>

                    <div className="mt-2 inline-flex items-center gap-2">
                      <span className="text-xs text-gray-500">Estado:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${chipColor}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-green-700">
                      S/ {order.total.toFixed(2)}
                    </p>
<button
  onClick={() =>
    navigate(`/orden/${order.order_id}`, {
      state: { order },
    })
  }
  className="px-4 py-1.5 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
>
  Seguir esta orden
</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;