import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "features/auth/useSession";

export default function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await login(form);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.error || "Error al iniciar sesión";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow max-w-md w-full space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo"
          className="w-full border rounded-md p-2"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border rounded-md p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}