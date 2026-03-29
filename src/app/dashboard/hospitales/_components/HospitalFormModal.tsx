"use client";

import { useState } from "react";
import { createHospitalAction, updateHospitalAction } from "../../../../modules/hospitales/hospital.actions";
import type { Hospital } from "../../../../modules/hospitales/types";

interface Props {
  mode: "create" | "edit";
  hospital?: Hospital;
}

export function HospitalFormModal({ mode, hospital }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
      >
        {mode === "create" ? "Nuevo Hospital" : "Editar"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mode === "create" ? "Nuevo Hospital" : "Editar Hospital"}
            </h2>

            <form
              action={async (formData) => {
                if (mode === "create") {
                  await createHospitalAction(formData);
                } else {
                  await updateHospitalAction(formData);
                }
                setIsOpen(false);
              }}
              className="space-y-4"
            >
              {mode === "edit" && (
                <input type="hidden" name="hospitalId" value={hospital?.hospitalId} />
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  type="text"
                  required
                  defaultValue={hospital?.nombre}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIT *
                </label>
                <input
                  name="nit"
                  type="text"
                  required
                  placeholder="800123456-7"
                  defaultValue={hospital?.nit}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  name="direccion"
                  type="text"
                  required
                  defaultValue={hospital?.direccion}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  name="telefono"
                  type="text"
                  required
                  defaultValue={hospital?.telefono}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

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
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {mode === "create" ? "Crear" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}