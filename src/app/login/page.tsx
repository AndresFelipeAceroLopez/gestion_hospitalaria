"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@lib/supabase/client";

const REMEMBER_KEY = "sgh_remember_email";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false); // 👈 evita error de hydration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [view, setView] = useState<"login" | "reset">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }
    } catch (err) {
      console.error("LocalStorage error:", err);
    }
  }, []);

  if (!mounted) return null; // 👈 evita errores de render en build

  const passwordUpdated = searchParams.get("updated") === "1";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createBrowserSupabaseClient();

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      // 👇 validación extra (evita falso login)
      if (!data.session) {
        setError("No se pudo iniciar sesión.");
        return;
      }

      if (remember) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Error inesperado. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");

    try {
      const supabase = createBrowserSupabaseClient();

      const { error: err } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        }
      );

      if (err) {
        setResetError("No se pudo enviar el correo.");
        return;
      }

      setResetSent(true);
    } catch (err) {
      console.error("RESET ERROR:", err);
      setResetError("Error inesperado.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700 text-white text-2xl font-bold mb-4 shadow">
            SH
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema Hospitalario
          </h1>
          <p className="text-sm text-gray-500 mt-1">SENA CEET · ADSO</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {view === "login" && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Iniciar sesión
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    Recordar correo
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setResetSent(false);
                      setResetError("");
                      setView("reset");
                    }}
                    className="text-sm text-green-700 hover:underline"
                  >
                    ¿Olvidé mi contraseña?
                  </button>
                </div>

                {passwordUpdated && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
                    Contraseña actualizada correctamente.
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="text-green-700 font-medium hover:underline"
                >
                  Regístrate
                </Link>
              </p>
            </>
          )}

          {view === "reset" && (
            <>
              <button
                onClick={() => setView("login")}
                className="text-sm text-gray-500 mb-5"
              >
                ← Volver
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Recuperar contraseña
              </h2>

              {resetSent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-sm text-green-800">
                  Revisa tu correo: <strong>{resetEmail}</strong>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5"
                  />

                  {resetError && (
                    <div className="text-red-600 text-sm">{resetError}</div>
                  )}

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-2.5 text-white bg-green-700 rounded-lg"
                  >
                    {resetLoading ? "Enviando..." : "Enviar enlace"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}