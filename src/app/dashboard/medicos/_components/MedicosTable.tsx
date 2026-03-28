"use client";

import type { MedicoConRelaciones } from "@modules/medicos/types";
import { deleteMedicoAction } from "@modules/medicos/medico.actions";
import { getFullName } from "@/src/lib/utils/utils";

interface Props {
  medicos: MedicoConRelaciones[];
}

export function MedicosTable({ medicos }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Especialidad</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Hospital</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Correo</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medicos.map((med, index) => (
            <tr key={`med-${med.medicoId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                Dr. {getFullName(med.nombre, med.apellido)}
              </td>
              <td className="px-4 py-3 text-gray-600">{med.especialidad?.nombre ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{med.hospital?.nombre ?? "—"}</td>
              <td className="px-4 py-3 text-gray-600">{med.telefono}</td>
              <td className="px-4 py-3 text-gray-600">{med.correoElectronico}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteMedicoAction.bind(null, null)}>
                  <input type="hidden" name="medicoId" value={med.medicoId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar a Dr. ${getFullName(med.nombre, med.apellido)}?`)) e.preventDefault();
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
