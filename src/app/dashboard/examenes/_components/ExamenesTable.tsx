"use client";

import type { OrdenExamenConRelaciones } from "@modules/examenes/types";
import { deleteOrdenExamenAction } from "@modules/examenes/examen.actions";
import { formatDate } from "@/src/lib/utils/utils";

interface Props {
  examenes: OrdenExamenConRelaciones[];
}

export function ExamenesTable({ examenes }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Visita</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha Orden</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {examenes.map((examen, index) => (
            <tr key={`ex-${examen.ordenExamenId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{examen.pacienteNombre}</td>
              <td className="px-4 py-3 text-gray-600">
                {examen.visitaFecha ? formatDate(examen.visitaFecha) : "—"}
                {examen.visitaHora ? ` ${examen.visitaHora}` : ""}
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(examen.fecha)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteOrdenExamenAction.bind(null, null)}>
                  <input type="hidden" name="ordenExamenId" value={examen.ordenExamenId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar orden de ${examen.pacienteNombre}?`)) e.preventDefault();
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
