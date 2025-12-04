// src/pages/TrackOrderPage.tsx
import React, { useState } from "react";
import { useSession } from "../features/auth/useSession";
import { getOrderStatus } from "../features/auth/api";

const TrackOrderPage: React.FC = () => {
  const { user } = useSession();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!orderId.trim()) {
      setError("Ingresa el número de pedido");
      return;
    }

    try {
      setLoading(true);
      const data = await getOrderStatus(orderId.trim());

      // Backend de ms-status devuelve algo tipo { resultado: {...} } o similar,
      // lo hacemos tolerante:
      const info = (data as any).resultado || (data as any).data || data;
      setResult(info);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          "No se pudo obtener el estado del pedido."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Sigue tu pedido</h1>
        <p className="text-gray-600 mb-6">
          Ingresa el número de pedido que aparece en la confirmación.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Ej: 4f3a2b1c9d..."
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Buscando..." : "Ver estado"}
          </button>
        </form>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h2 className="text-xl font-bold mb-3">
              Pedido #{result.order_id || orderId}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Cliente: {result.customer_id || user?.user_id || "N/D"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Fecha: {result.created_at || "N/D"}
            </p>

            <div className="mb-4">
              <span className="text-sm text-gray-500">Estado actual</span>
              <p className="text-lg font-bold text-green-700">
                {result.status || "Desconocido"}
              </p>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="text-xl font-bold">
                S/ {(result.total || 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;