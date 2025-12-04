import axios from "axios";

// Base URLs
export const API_ORDERS = "https://1qvyjv74r3.execute-api.us-east-1.amazonaws.com/dev";
export const API_FULFILL = "https://gc8sncxhie.execute-api.us-east-1.amazonaws.com/dev";
export const API_STATUS = "https://93icxxrllb.execute-api.us-east-1.amazonaws.com/dev";
export const API_USERS = "https://9yr496f7r7.execute-api.us-east-1.amazonaws.com/dev";

// Tenant por defecto
const TENANT_ID = "CHINAWOK_LIMA_CENTRO";
const TOKEN_KEY = "auth_token";

// Axios instances
const apiOrders = axios.create({
  baseURL: API_ORDERS,
  headers: { "x-tenant-id": TENANT_ID, "Content-Type": "application/json" },
});

const apiFulfill = axios.create({
  baseURL: API_FULFILL,
  headers: { "x-tenant-id": TENANT_ID, "Content-Type": "application/json" },
});

const apiStatus = axios.create({
  baseURL: API_STATUS,
  headers: { "x-tenant-id": TENANT_ID, "Content-Type": "application/json" },
});

const apiUsers = axios.create({
  baseURL: API_USERS,
  headers: { "x-tenant-id": TENANT_ID, "Content-Type": "application/json" },
});

// ✅ Interceptor para agregar token automáticamente
[apiOrders, apiFulfill, apiStatus, apiUsers].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

// ------------------------ TIPOS ------------------------
export type BackendUser = {
  tenant_id: string;
  user_id: string;
  correo: string;
  nombre: string;
  apellidos: string;
  dni: string;
  rol: string;
};

export type LoginResponse = {
  message: string;
  access_token: string;
  token_type: string;
  expires_in: string;
  user: BackendUser;
};

export type RegisterResponse = {
  message: string;
  tenant_id: string;
  user_id: string;
};

// ------------------------ AUTENTICACION ------------------------

/**
 * POST /auth/login
 * Body: { correo, password }
 * Headers: x-tenant-id
 */
export async function login(correo: string, password: string): Promise<LoginResponse> {
  const { data } = await apiUsers.post("/auth/login", { correo, password });
  return data;
}

/**
 * POST /users
 * Body: { nombres, apellidos, dni, correo, password, rol }
 * Headers: x-tenant-id
 * Roles válidos: "COCINERO", "DESPACHADOR", "REPARTIDOR", "USUARIO", "ADMIN"
 */
export async function register(payload: {
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  password: string;
  rol: "COCINERO" | "DESPACHADOR" | "REPARTIDOR" | "USUARIO" | "ADMIN";
}): Promise<RegisterResponse> {
  const { data } = await apiUsers.post("/users", payload);
  return data;
}

// ------------------------ PEDIDOS ------------------------

/**
 * POST /orders
 * Body: { customer_id, items: [{ product_id, quantity, price }] }
 * Headers: x-tenant-id
 */
export async function createOrder(order: {
  customer_id: string;
  items: { product_id: string; quantity: number; price: number }[];
}) {
  const { data } = await apiOrders.post("/orders", order);
  return data;
}

/**
 * GET /orders/customer/{customer_id}
 * Headers: x-tenant-id
 */
export async function getOrdersByCustomer(customer_id: string) {
  const { data } = await apiOrders.get(`/orders/customer/${customer_id}`);
  return data;
}

/**
 * GET /orders?status={status}
 * Headers: x-tenant-id
 * Status válidos: "PENDIENTE", "COCINANDO", "EMPACANDO", "EN_REPARTO", "ENTREGADO", "CANCELADO"
 */
export async function getOrdersByStatus(status: string) {
  const { data } = await apiOrders.get(`/orders?status=${status}`);
  return data;
}

/**
 * PATCH /orders/{order_id}/cancel
 * Body: { cancelled_by, reason }
 * Headers: x-tenant-id
 */
export async function cancelOrder(order_id: string, cancelled_by: string, reason: string) {
  const { data } = await apiOrders.patch(`/orders/${order_id}/cancel`, { cancelled_by, reason });
  return data;
}

// ------------------------ CUMPLIMIENTO ------------------------

/**
 * POST /orders/{order_id}/assign-cook
 * Body: { staff_id, staff_name }
 * Headers: x-tenant-id
 */
export async function assignCook(order_id: string, staff_id: string, staff_name: string) {
  const { data } = await apiFulfill.post(`/orders/${order_id}/assign-cook`, { staff_id, staff_name });
  return data;
}

/**
 * POST /orders/{order_id}/mark-packed
 * Body: { staff_id, staff_name }
 * Headers: x-tenant-id
 */
export async function markPacked(order_id: string, staff_id: string, staff_name: string) {
  const { data } = await apiFulfill.post(`/orders/${order_id}/mark-packed`, { staff_id, staff_name });
  return data;
}

/**
 * POST /orders/{order_id}/assign-delivery
 * Body: { staff_id, staff_name }
 * Headers: x-tenant-id
 */
export async function assignDelivery(order_id: string, staff_id: string, staff_name: string) {
  const { data } = await apiFulfill.post(`/orders/${order_id}/assign-delivery`, { staff_id, staff_name });
  return data;
}

/**
 * POST /orders/{order_id}/mark-delivered
 * Body: { staff_id, staff_name }
 * Headers: x-tenant-id
 */
export async function markDelivered(order_id: string, staff_id: string, staff_name: string) {
  const { data } = await apiFulfill.post(`/orders/${order_id}/mark-delivered`, { staff_id, staff_name });
  return data;
}

// ------------------------ STATUS ------------------------

/**
 * GET /status/order/{order_id}
 * Headers: x-tenant-id
 */
export async function getOrderStatus(order_id: string) {
  const { data } = await apiStatus.get(`/status/order/${order_id}`);
  return data;
}

/**
 * GET /status/order/{order_id}/history
 * Headers: x-tenant-id
 */
export async function getOrderHistory(order_id: string) {
  const { data } = await apiStatus.get(`/status/order/${order_id}/history`);
  return data;
}

/**
 * GET /status/dashboard
 * Headers: x-tenant-id
 */
export async function getDashboard() {
  const { data } = await apiStatus.get("/status/dashboard");
  return data;
}

/**
 * GET /status/customer/{customer_id}
 * Headers: x-tenant-id
 */
export async function getOrdersByCustomerStatus(customer_id: string) {
  const { data } = await apiStatus.get(`/status/customer/${customer_id}`);
  return data;
}