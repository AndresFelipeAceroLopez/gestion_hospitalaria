"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@lib/supabase/client";

const REMEMBER_KEY = "sgh_remember_email";

export default function LoginPage() {
  const router = useRouter();

  const [passwordUpdated, setPasswordUpdated] = useState(false);

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

  // 🔥 FIX: manejar search params en cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setPasswordUpdated(params.get("updated") === "1");
    }
  }, []);

  // Recordar email
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

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";

    const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${origin}/auth/callback?type=recovery`,
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

          {/* LOGIN */}
          {view === "login" && (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Iniciar sesión
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@correo.com"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm"
                />

                <div className="flex justify-between text-sm">
                  <label>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />{" "}
                    Recordar
                  </label>

                  <button type="button" onClick={() => setView("reset")}>
                    ¿Olvidé contraseña?
                  </button>
                </div>

                {passwordUpdated && (
                  <div className="text-green-600 text-sm">
                    Contraseña actualizada correctamente
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm">{error}</div>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>
            </>
          )}

          {/* RESET */}
          {view === "reset" && (
            <>
              <button onClick={() => setView("login")}>← Volver</button>

              <form onSubmit={handleResetPassword}>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />

                {resetError && <div>{resetError}</div>}

                <button type="submit">
                  {resetLoading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}