"use client";

import type { VisitaConRelaciones } from "@modules/visitas/types";
import { getFullName, formatDate } from "@/src/lib/utils/utils";

interface Props {
  visitas: VisitaConRelaciones[];
}

export function VisitasTable({ visitas }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Médico</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Hora</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {visitas.map((visita, index) => (
            <tr key={`v-${visita.visitaId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-400 text-xs">{visita.visitaId}</td>
              <td className="px-4 py-3 font-medium text-gray-900">
                {getFullName(visita.paciente.nombre, visita.paciente.apellido)}
              </td>
              <td className="px-4 py-3 text-gray-600">
                Dr. {getFullName(visita.medico.nombre, visita.medico.apellido)}
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(visita.fecha)}</td>
              <td className="px-4 py-3 text-gray-600">{visita.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
