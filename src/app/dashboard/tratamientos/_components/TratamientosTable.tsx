"use client";

import type { TratamientoConRelaciones } from "@modules/tratamientos/types";
import { deleteTratamientoAction } from "@modules/tratamientos/tratamiento.actions";
import { formatDate } from "@/src/lib/utils/utils";

interface Props {
  tratamientos: TratamientoConRelaciones[];
}

export function TratamientosTable({ tratamientos }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Visita</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha Inicio</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha Fin</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tratamientos.map((trat, index) => (
            <tr key={`t-${trat.tratamientoId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{trat.pacienteNombre}</td>
              <td className="px-4 py-3 text-gray-600">
                {trat.visitaFecha ? formatDate(trat.visitaFecha) : "—"}
                {trat.visitaHora ? ` ${trat.visitaHora}` : ""}
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(trat.fechaInicio)}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(trat.fechaFin)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteTratamientoAction.bind(null, null)}>
                  <input type="hidden" name="tratamientoId" value={trat.tratamientoId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar tratamiento de ${trat.pacienteNombre}?`)) e.preventDefault();
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
