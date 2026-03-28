"use client";

import type { Especialidad } from "@modules/especialidades/types";
import { deleteEspecialidadAction } from "@modules/especialidades/especialidad.actions";

interface Props {
  especialidades: Especialidad[];
}

export function EspecialidadesTable({ especialidades }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {especialidades.map((esp, index) => (
            <tr key={`esp-${esp.especialidadId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-400 text-xs">{esp.especialidadId}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{esp.nombre}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteEspecialidadAction.bind(null, null)}>
                  <input type="hidden" name="especialidadId" value={esp.especialidadId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar "${esp.nombre}"?`)) e.preventDefault();
                    }}
                  >
                    Eliminar
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
