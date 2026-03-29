"use client";

import type { Incapacidad } from "@modules/incapacidades/types";
import { deleteIncapacidadAction } from "@modules/incapacidades/incapacidad.actions";
import { formatDate } from "@/src/lib/utils/utils";

interface Props {
  incapacidades: Incapacidad[];
}

export function IncapacidadesTable({ incapacidades }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">ID</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">ID Tratamiento</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {incapacidades.map((inc, index) => (
            <tr key={`i-${inc.incapacidadId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-400 text-xs">{inc.incapacidadId}</td>
              <td className="px-4 py-3 text-gray-600">{inc.tratamientoId}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(inc.fecha)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteIncapacidadAction.bind}>
                  <input type="hidden" name="incapacidadId" value={inc.incapacidadId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar incapacidad #${inc.incapacidadId}?`)) e.preventDefault();
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
