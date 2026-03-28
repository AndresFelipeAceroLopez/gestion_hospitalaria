"use client";

import { useState, useActionState } from "react";
import { createPacienteAction } from "@modules/pacientes/paciente.actions";
import type { Paciente } from "@modules/pacientes/types";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

interface Props {
  mode: "create" | "edit";
  paciente?: Paciente;
}

export function PacienteFormModal({ mode, paciente }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    createPacienteAction,
    null
  );

  if (state?.success) setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nuevo Paciente" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nuevo Paciente" : "Editar Paciente"}
            </h2>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input name="nombre" type="text" required defaultValue={paciente?.nombre}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nombre" />
                  {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input name="apellido" type="text" required defaultValue={paciente?.apellido}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Apellido" />
                  {state?.errors?.apellido && <p className="text-red-500 text-xs mt-1">{state.errors.apellido[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento *</label>
                  <input name="fechaNacimiento" type="date" required defaultValue={paciente?.fechaNacimiento}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  {state?.errors?.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{state.errors.fechaNacimiento[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                  <select name="sexo" required defaultValue={paciente?.sexo ?? ""}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="" disabled>Seleccionar</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                  {state?.errors?.sexo && <p className="text-red-500 text-xs mt-1">{state.errors.sexo[0]}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <input name="direccion" type="text" required defaultValue={paciente?.direccion}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Calle 123 # 45-67, Ciudad" />
                  {state?.errors?.direccion && <p className="text-red-500 text-xs mt-1">{state.errors.direccion[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input name="telefono" type="text" required defaultValue={paciente?.telefono}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="3001234567" />
                  {state?.errors?.telefono && <p className="text-red-500 text-xs mt-1">{state.errors.telefono[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                  <input name="correoElectronico" type="email" required defaultValue={paciente?.correoElectronico}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="paciente@correo.com" />
                  {state?.errors?.correoElectronico && <p className="text-red-500 text-xs mt-1">{state.errors.correoElectronico[0]}</p>}
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
                  {isPending ? "Guardando..." : mode === "create" ? "Registrar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
