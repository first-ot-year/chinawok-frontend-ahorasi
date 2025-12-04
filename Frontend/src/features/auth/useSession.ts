// src/features/auth/useSession.ts
import { create } from "zustand";
import * as api from "./api";

export type SessionStatus = "unknown" | "authenticated" | "unauthenticated";

export interface SessionUser {
  tenant_id: string;
  user_id: string;
  correo: string;
  nombre: string;
  apellidos: string;
  dni: string;
  rol: string;
}

interface LoginBody {
  correo: string;
  password: string;
}

interface RegisterBody {
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  password: string;
  rol: "COCINERO" | "DESPACHADOR" | "REPARTIDOR" | "USUARIO" | "ADMIN";
}

interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;

  login: (body: LoginBody) => Promise<SessionUser>;
  register: (body: RegisterBody) => Promise<void>; // ⬅️ Cambiado: ya no devuelve SessionUser
  logout: () => void;
  
  initSession: () => Promise<void>;
  
}

const TOKEN_KEY = "auth_token";

export const useSession = create<SessionState>((set) => ({
  user: null,
  status: "unknown",

  // -------- LOGIN --------
  async login(body) {
    const data = await api.login(body.correo, body.password);

    const token = data.access_token;
    const user: SessionUser = data.user;

    localStorage.setItem(TOKEN_KEY, token);
    set({ user, status: "authenticated" });

    return user;
  },

  // -------- REGISTER (sin auto-login) --------
  async register(body) {
    await api.register(body);
    // ⬅️ ELIMINADO: el auto-login que causaba el error
    // Usuario deberá hacer login manualmente
  },

  // -------- INIT SESSION --------
  async initSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ user: null, status: "unauthenticated" });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, status: "unauthenticated" });
        return;
      }

      const user: SessionUser = {
        tenant_id: payload.tenant_id,
        user_id: payload.user_id,
        correo: payload.correo,
        nombre: "",
        apellidos: "",
        dni: "",
        rol: payload.rol,
      };

      set({ user, status: "authenticated" });
    } catch (err) {
      console.error("Error al inicializar sesión:", err);
      localStorage.removeItem(TOKEN_KEY);
      set({ user: null, status: "unauthenticated" });
    }
  },

  // -------- LOGOUT --------
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, status: "unauthenticated" });
  },
}));