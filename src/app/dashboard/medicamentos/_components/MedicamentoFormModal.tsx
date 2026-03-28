"use client";

import { useState, useActionState } from "react";
import { createMedicamentoAction } from "@modules/medicamentos/medicamento.actions";
import type { Medicamento } from "@modules/medicamentos/types";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

interface Props {
  mode: "create" | "edit";
  medicamento?: Medicamento;
}

export function MedicamentoFormModal({ mode, medicamento }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    createMedicamentoAction,
    null
  );

  if (state?.success) setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nuevo Medicamento" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nuevo Medicamento" : "Editar Medicamento"}
            </h2>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input name="nombre" type="text" required defaultValue={medicamento?.nombre}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej. Ibuprofeno" />
                  {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea name="descripcion" required rows={2} defaultValue={medicamento?.descripcion}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Descripción del medicamento..." />
                  {state?.errors?.descripcion && <p className="text-red-500 text-xs mt-1">{state.errors.descripcion[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input name="cantidad" type="number" required min={0} defaultValue={medicamento?.cantidad}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="100" />
                  {state?.errors?.cantidad && <p className="text-red-500 text-xs mt-1">{state.errors.cantidad[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidades *</label>
                  <input name="unidades" type="text" required defaultValue={medicamento?.unidades}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej. mg, ml, comprimidos" />
                  {state?.errors?.unidades && <p className="text-red-500 text-xs mt-1">{state.errors.unidades[0]}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescripción *</label>
                  <input name="prescripcion" type="text" required defaultValue={medicamento?.prescripcion}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ej. Con o sin receta médica" />
                  {state?.errors?.prescripcion && <p className="text-red-500 text-xs mt-1">{state.errors.prescripcion[0]}</p>}
                </div>
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
