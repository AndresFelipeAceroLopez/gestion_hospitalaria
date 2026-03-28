"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@lib/supabase/client";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createBrowserSupabaseClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
      },
    });

    if (authError) {
      setError(authError.message === "User already registered"
        ? "Este correo ya está registrado. Intente iniciar sesión."
        : "No se pudo crear la cuenta. Intente de nuevo.");
    } else {
      setSuccess(true);
    }

    setLoading(false);
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
          {success ? (
            /* Estado: correo de confirmación enviado */
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 text-2xl mb-2">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                ¡Cuenta creada!
              </h2>
              <p className="text-sm text-gray-500">
                Enviamos un correo de confirmación a{" "}
                <strong className="text-gray-700">{email}</strong>.<br />
                Revise su bandeja de entrada para activar su cuenta.
              </p>
              <Link
                href="/login"
                className="block w-full py-2.5 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors text-center mt-4"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Crear cuenta
              </h2>

              <form onSubmit={handleRegister} className="space-y-4">
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
                    autoComplete="new-password"
                    placeholder="Mínimo 6 caracteres"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="Repita la contraseña"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

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
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-green-700 font-medium hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
