"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@lib/supabase/client";

const REMEMBER_KEY = "sgh_remember_email";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordUpdated = searchParams.get("updated") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Vista: "login" | "reset"
  const [view, setView] = useState<"login" | "reset">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Pre-rellenar email si fue recordado previamente
  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    if (remember) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleResetPassword(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");

    const supabase = createBrowserSupabaseClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (err) {
      setResetError("No se pudo enviar el correo. Verifique la dirección.");
    } else {
      setResetSent(true);
    }
    setResetLoading(false);
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700 text-white text-2xl font-bold mb-4 shadow">
            SH
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema Hospitalario</h1>
          <p className="text-sm text-gray-500 mt-1">SENA CEET · ADSO</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* ── Vista: Login ── */}
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
                    placeholder="usuario@correo.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Recordar + Olvidé contraseña */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                    Contraseña actualizada. Inicie sesión con su nueva contraseña.
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
                  className="w-full py-2.5 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="text-green-700 font-medium hover:underline">
                  Regístrate
                </Link>
              </p>
            </>
          )}

          {/* ── Vista: Recuperar contraseña ── */}
          {view === "reset" && (
            <>
              <button
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
              >
                ← Volver
              </button>

              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Recuperar contraseña
              </h2>

              {resetSent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-sm text-green-800">
                  Se envió un enlace de recuperación a{" "}
                  <strong>{resetEmail}</strong>. Revise su bandeja de entrada.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Ingrese su correo registrado y le enviaremos un enlace para
                    restablecer su contraseña.
                  </p>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        placeholder="usuario@correo.com"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {resetError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                        {resetError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-2.5 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
                    >
                      {resetLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
