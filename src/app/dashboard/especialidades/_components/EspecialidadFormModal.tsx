"use client";

import { useState, useActionState } from "react";
import { createEspecialidadAction } from "@modules/especialidades/especialidad.actions";
import type { Especialidad } from "@modules/especialidades/types";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

interface Props {
  mode: "create" | "edit";
  especialidad?: Especialidad;
}

export function EspecialidadFormModal({ mode, especialidad }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    createEspecialidadAction,
    null
  );

  if (state?.success) setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nueva Especialidad" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nueva Especialidad" : "Editar Especialidad"}
            </h2>

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  type="text"
                  required
                  defaultValue={especialidad?.nombre}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ej. Cardiología"
                />
                {state?.errors?.nombre && (
                  <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>
                )}
              </div>

              {state && !state.success && state.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                  {state.message}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
