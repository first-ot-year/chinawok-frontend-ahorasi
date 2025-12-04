import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

const ROLES = [
  { value: "USUARIO", label: "Usuario" },
  { value: "COCINERO", label: "Cocinero" },
  { value: "DESPACHADOR", label: "Despachador" },
  { value: "REPARTIDOR", label: "Repartidor" },
  { value: "ADMIN", label: "Administrador" },
] as const;

export default function RegisterPage() {
  const { register } = useSession();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    correo: "",
    password: "",
    confirmPassword: "",
    rol: "USUARIO" as "COCINERO" | "DESPACHADOR" | "REPARTIDOR" | "USUARIO" | "ADMIN",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Validaciones...
  if (form.password !== form.confirmPassword) {
    setError("Las contraseñas no coinciden");
    setLoading(false);
    return;
  }

  if (form.password.length < 6) {
    setError("La contraseña debe tener al menos 6 caracteres");
    setLoading(false);
    return;
  }

  if (form.dni.length !== 8 || !/^\d+$/.test(form.dni)) {
    setError("El DNI debe tener exactamente 8 dígitos");
    setLoading(false);
    return;
  }

  try {
    await register({
      nombres: form.nombres,
      apellidos: form.apellidos,
      dni: form.dni,
      correo: form.correo,
      password: form.password,
      rol: form.rol,
    });
    
    // ✅ Redirigir a login después del registro exitoso
    alert("Registro exitoso. Por favor inicia sesión.");
    navigate("/login");
  } catch (err: any) {
    console.error(err);
    const message = err.response?.data?.message || err.response?.data?.error || "Error al registrarse";
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full space-y-4"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-gray-600">Regístrate en China Wok</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres
            </label>
            <input
              type="text"
              placeholder="Juan"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.nombres}
              onChange={(e) => setForm({ ...form, nombres: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              placeholder="Pérez"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DNI
          </label>
          <input
            type="text"
            placeholder="12345678"
            maxLength={8}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.dni}
            onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, "") })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="juan@ejemplo.com"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value as typeof form.rol })}
            required
          >
            {ROLES.map((rol) => (
              <option key={rol.value} value={rol.value}>
                {rol.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Registrando..." : "Crear cuenta"}
        </button>

        <div className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-medium"
          >
            Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
}