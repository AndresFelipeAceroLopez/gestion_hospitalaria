"use client";

import { useState, useActionState } from "react";
import { createIncapacidadAction } from "@modules/incapacidades/incapacidad.actions";
import type { Incapacidad } from "@modules/incapacidades/types";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

interface TratamientoOption {
  tratamientoId: string;
  fechaInicio: string;
  visitaFecha: string;
  visitaHora: string;
  pacienteNombre: string;
}

interface Props {
  mode: "create" | "edit";
  incapacidad?: Incapacidad;
  tratamientos: TratamientoOption[];
}

function formatFecha(fecha: string) {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

export function IncapacidadFormModal({ mode, incapacidad, tratamientos }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    createIncapacidadAction,
    null
  );

  if (state?.success) setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nueva Incapacidad" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nueva Incapacidad" : "Editar Incapacidad"}
            </h2>

            <form action={formAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento asociado *</label>
                <select
                  name="tratamientoId"
                  required
                  defaultValue={incapacidad?.tratamientoId ?? ""}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="" disabled>Seleccione un tratamiento</option>
                  {tratamientos.map((t) => (
                    <option key={t.tratamientoId} value={t.tratamientoId}>
                      {t.pacienteNombre} — {formatFecha(t.visitaFecha)} {t.visitaHora}
                    </option>
                  ))}
                </select>
                {state?.errors?.tratamientoId && <p className="text-red-500 text-xs mt-1">{state.errors.tratamientoId[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                <input name="fecha" type="date" required defaultValue={incapacidad?.fecha}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                {state?.errors?.fecha && <p className="text-red-500 text-xs mt-1">{state.errors.fecha[0]}</p>}
              </div>

              {state && !state.success && state.message && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                  {state.message}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
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
