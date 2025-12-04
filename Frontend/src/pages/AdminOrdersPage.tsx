// src/pages/AdminOrdersPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrdersByStatus,
  assignCook,
  markPacked,
  assignDelivery,
  markDelivered,
  type Order,
} from "../features/auth/api";
import { useSession } from "../features/auth/useSession";

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  COCINANDO: "En cocina",
  EMPACANDO: "Empacando",
  EN_REPARTO: "En reparto",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const STATUS_OPTIONS = [
  "PENDIENTE",
  "COCINANDO",
  "EMPACANDO",
  "EN_REPARTO",
  "ENTREGADO",
  "CANCELADO",
];

function statusChipClasses(status: string) {
  switch (status) {
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-800";
    case "COCINANDO":
      return "bg-orange-100 text-orange-800";
    case "EMPACANDO":
      return "bg-blue-100 text-blue-800";
    case "EN_REPARTO":
      return "bg-purple-100 text-purple-800";
    case "ENTREGADO":
      return "bg-green-100 text-green-800";
    case "CANCELADO":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "N/D";
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

function formatOrderCode(orderId: string): string {
  if (!orderId) return "";
  const short = orderId.replace(/-/g, "").slice(0, 8).toUpperCase();
  return `CHW-${short}`;
}

// Determina la acción disponible según el status
type ActionType = "ASSIGN_COOK" | "PACK" | "ASSIGN_DELIVERY" | "MARK_DELIVERED" | null;

function getNextActionForStatus(status: string): ActionType {
  switch (status) {
    case "PENDIENTE":
      return "ASSIGN_COOK";
    case "COCINANDO":
      return "PACK";
    case "EMPACANDO":
      return "ASSIGN_DELIVERY";
    case "EN_REPARTO":
      return "MARK_DELIVERED";
    default:
      return null;
  }
}

function getActionLabel(action: ActionType): string {
  switch (action) {
    case "ASSIGN_COOK":
      return "Asignar cocinero";
    case "PACK":
      return "Marcar empacado";
    case "ASSIGN_DELIVERY":
      return "Asignar repartidor";
    case "MARK_DELIVERED":
      return "Marcar entregado";
    default:
      return "";
  }
}

const AdminOrdersPage: React.FC = () => {
  const { user, status } = useSession();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<string>("PENDIENTE");
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, Order[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    // Opcional: restringir a ADMIN / STAFF
    if (user && !["ADMIN", "COCINERO", "DESPACHADOR", "REPARTIDOR"].includes(user.rol)) {
      setError("No tienes permisos para ver este panel.");
      return;
    }

    loadAllStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, status]);

  const loadAllStatuses = async () => {
    try {
      setLoading(true);
      setError("");
      const results: Record<string, Order[]> = {};

      // Traemos órdenes por cada estado usando ms-pedidos
      for (const st of STATUS_OPTIONS) {
        try {
          const resp = await getOrdersByStatus(st);
          // ms-pedidos: { success: boolean, data: Order[] }
          const list: Order[] = (resp as any).data || resp || [];
          results[st] = Array.isArray(list) ? list : [];
        } catch (e) {
          // si falla un estado, seguimos con los demás
          results[st] = [];
          console.error("Error cargando estado", st, e);
        }
      }

      setOrdersByStatus(results);
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.error ||
          "No se pudieron cargar las órdenes. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (order: Order) => {
    if (!user) {
      alert("Debes iniciar sesión como staff para operar órdenes.");
      navigate("/login");
      return;
    }

    const action = getNextActionForStatus(order.status);
    if (!action) return;

    const staff_id = user.user_id;
    const staff_name = `${user.nombre} ${user.apellidos}`.trim() || user.correo;

    try {
      setLoadingActionId(order.order_id);
      setError("");

      if (action === "ASSIGN_COOK") {
        await assignCook(order.order_id, staff_id, staff_name);
      } else if (action === "PACK") {
        await markPacked(order.order_id, staff_id, staff_name);
      } else if (action === "ASSIGN_DELIVERY") {
        await assignDelivery(order.order_id, staff_id, staff_name);
      } else if (action === "MARK_DELIVERED") {
        await markDelivered(order.order_id, staff_id, staff_name);
      }

      alert(`Acción "${getActionLabel(action)}" ejecutada correctamente.`);
      await loadAllStatuses();
    } catch (e: any) {
      console.error(e);
      alert(
        e?.response?.data?.error ||
          "No se pudo ejecutar la acción. Revisa si el pedido está en el paso correcto del flujo."
      );
    } finally {
      setLoadingActionId(null);
    }
  };

  const currentOrders = ordersByStatus[selectedStatus] || [];

  // Totales para cards
  const totalByStatus: Record<string, number> = STATUS_OPTIONS.reduce(
    (acc, st) => ({ ...acc, [st]: (ordersByStatus[st] || []).length }),
    {} as Record<string, number>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold">Inicia sesión como administrador o staff</h1>
          <p className="text-gray-600 text-sm">
            Este panel es solo para personal del restaurante.
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

  if (error && !loading && !ordersByStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 text-sm">{error}</p>
          <button
            onClick={loadAllStatuses}
            className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-black"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Panel de Órdenes (Staff)</h1>
            <p className="text-gray-600 text-sm mt-1">
              Controla el flujo de los pedidos a través de la cocina, empaque y reparto.
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            Staff:{" "}
            <span className="font-semibold">
              {user.nombre} {user.apellidos} ({user.rol})
            </span>
          </div>
        </div>

        {/* Resumen por estado */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {STATUS_OPTIONS.map((st) => (
            <div
              key={st}
              className={`cursor-pointer bg-white rounded-lg p-3 shadow-sm border text-center ${
                selectedStatus === st ? "border-green-600" : "border-gray-200"
              }`}
              onClick={() => setSelectedStatus(st)}
            >
              <p className="text-xs text-gray-500 mb-1">
                {STATUS_LABELS[st] || st}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalByStatus[st] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {/* Filtro de estado + reload */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrando estado:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 bg-white"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {STATUS_LABELS[st] || st}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={loadAllStatuses}
            disabled={loading}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Tabla de órdenes */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Pedido
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentOrders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-gray-500">
                      No hay órdenes con este estado.
                    </td>
                  </tr>
                )}

                {currentOrders.map((order) => {
                  const action = getNextActionForStatus(order.status);
                  const hasAction = !!action;
                  const isBusy = loadingActionId === order.order_id;

                  return (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {formatOrderCode(order.order_id)}
                          </span>
                          <span className="text-[11px] text-gray-500 break-all">
                            {order.order_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">
                          <span className="font-medium">
                            Cliente ID: {order.customer_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${statusChipClasses(
                            order.status
                          )}`}
                        >
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-gray-900">
                          S/ {order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {hasAction ? (
                          <button
                            onClick={() => handleAction(order)}
                            disabled={isBusy}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
                          >
                            {isBusy
                              ? "Ejecutando..."
                              : getActionLabel(action)}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Sin acciones
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {loading && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      Cargando órdenes...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="mt-4 text-xs text-gray-500">
          Las acciones llaman directamente a los endpoints de cumplimiento:
          asignar cocinero, marcar empacado, asignar repartidor y marcar
          entregado, que a su vez reanudan la Step Function.
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
