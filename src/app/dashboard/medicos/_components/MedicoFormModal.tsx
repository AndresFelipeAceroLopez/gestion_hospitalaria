"use client";

import { useState, useActionState } from "react";
import { createMedicoAction } from "@modules/medicos/medico.actions";
import type { MedicoConRelaciones } from "@modules/medicos/types";

type FormState = { success: boolean; message: string; errors?: Record<string, string[]> };

interface OpcionSelect { id: number; nombre: string; }

interface Props {
  mode: "create" | "edit";
  medico?: MedicoConRelaciones;
  especialidades: OpcionSelect[];
  hospitales: OpcionSelect[];
}

const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";

export function MedicoFormModal({ mode, medico, especialidades, hospitales }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    createMedicoAction,
    null
  );

  if (state?.success) setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nuevo Médico" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nuevo Médico" : "Editar Médico"}
            </h2>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input name="nombre" type="text" required defaultValue={medico?.nombre}
                    className={selectClass} placeholder="Nombre" />
                  {state?.errors?.nombre && <p className="text-red-500 text-xs mt-1">{state.errors.nombre[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input name="apellido" type="text" required defaultValue={medico?.apellido}
                    className={selectClass} placeholder="Apellido" />
                  {state?.errors?.apellido && <p className="text-red-500 text-xs mt-1">{state.errors.apellido[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                  <select name="especialidadId" required defaultValue={medico?.especialidadId ?? ""} className={selectClass}>
                    <option value="" disabled>Seleccione especialidad</option>
                    {especialidades.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                  {state?.errors?.especialidadId && <p className="text-red-500 text-xs mt-1">{state.errors.especialidadId[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                  <select name="hospitalId" required defaultValue={medico?.hospitalId ?? ""} className={selectClass}>
                    <option value="" disabled>Seleccione hospital</option>
                    {hospitales.map((h) => (
                      <option key={h.id} value={h.id}>{h.nombre}</option>
                    ))}
                  </select>
                  {state?.errors?.hospitalId && <p className="text-red-500 text-xs mt-1">{state.errors.hospitalId[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input name="telefono" type="text" required defaultValue={medico?.telefono}
                    className={selectClass} placeholder="3001234567" />
                  {state?.errors?.telefono && <p className="text-red-500 text-xs mt-1">{state.errors.telefono[0]}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico *</label>
                  <input name="correoElectronico" type="email" required defaultValue={medico?.correoElectronico}
                    className={selectClass} placeholder="medico@hospital.com" />
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
