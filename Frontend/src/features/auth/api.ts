import axios from "axios";

// Base URLs
export const API_ORDERS = "https://1qvyjv74r3.execute-api.us-east-1.amazonaws.com/dev";
export const API_FULFILL = "https://gc8sncxhie.execute-api.us-east-1.amazonaws.com/dev";
export const API_STATUS = "https://93icxxrllb.execute-api.us-east-1.amazonaws.com/dev";
export const API_USERS = "https://9yr496f7r7.execute-api.us-east-1.amazonaws.com/dev";
export const API_PRODUCTS = "https://h8ulb6856m.execute-api.us-east-1.amazonaws.com/dev";

// Tenant por defecto
const TENANT_ID = "CHINAWOK_LIMA_CENTRO";
const TOKEN_KEY = "auth_token";

const apiProducts = axios.create({
  baseURL: API_PRODUCTS,
  headers: { "x-tenant-id": TENANT_ID, "Content-Type": "application/json" },
});


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
[apiOrders, apiFulfill, apiStatus, apiUsers, apiProducts].forEach((instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

// ------------------------ TIPOS ------------------------
export type Product = {
  tenant_id: string;
  product_id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  tag?: string;
  imageUrl: string;
  available: boolean;
  created_at: string;
  updated_at: string;
};
export type BackendUser = {
  tenant_id: string;
  user_id: string;
  correo: string;
  nombre: string;
  apellidos: string;
  dni: string;
  rol: string;
};

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  success: boolean;
  message: string;
  data: Order;
}

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

export interface Order {
  tenant_id: string;
  order_id: string;
  customer_id: string;
  status: string;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}


export async function getUploadUrl(fileName: string, contentType: string) {
  const { data } = await apiProducts.post("/upload-url", {
    fileName,
    contentType,
  });
  return data;
}

// Función para subir imagen a S3
export async function uploadImageToS3(file: File): Promise<string> {
  try {
    // 1. Obtener URL prefirmada
    const { uploadUrl, publicUrl } = await getUploadUrl(file.name, file.type);
    
    // 2. Subir archivo directamente a S3
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    // 3. Retornar URL pública
    return publicUrl;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw new Error("No se pudo subir la imagen");
  }
}

// Funciones - PRODUCTOS
export async function getProducts(category?: string) {
  const params = category ? { category } : {};
  const { data } = await apiProducts.get("/products", { params });
  return data;
}

export async function getProductById(product_id: string) {
  const { data } = await apiProducts.get(`/products/${product_id}`);
  return data;
}

export async function createProduct(product: Omit<Product, "tenant_id" | "product_id" | "created_at" | "updated_at">) {
  const { data } = await apiProducts.post("/products", product);
  return data;
}

export async function updateProduct(product_id: string, updates: Partial<Product>) {
  const { data } = await apiProducts.put(`/products/${product_id}`, updates);
  return data;
}

export async function deleteProduct(product_id: string) {
  const { data } = await apiProducts.delete(`/products/${product_id}`);
  return data;
}

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
}): Promise<CreateOrderResponse> {
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