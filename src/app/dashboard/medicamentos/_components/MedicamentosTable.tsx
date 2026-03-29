"use client";

import type { Medicamento } from "@modules/medicamentos/types";
import { deleteMedicamentoAction } from "@modules/medicamentos/medicamento.actions";
import { truncate } from "@/src/lib/utils/utils";

interface Props {
  medicamentos: Medicamento[];
}

export function MedicamentosTable({ medicamentos }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Cantidad</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Unidades</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Prescripción</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medicamentos.map((med, index) => (
            <tr key={`m-${med.medicamentoId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{med.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{truncate(med.descripcion, 40)}</td>
              <td className="px-4 py-3 text-gray-600">{med.cantidad}</td>
              <td className="px-4 py-3 text-gray-600">{med.unidades}</td>
              <td className="px-4 py-3 text-gray-600">{truncate(med.prescripcion, 30)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteMedicamentoAction.bind}>
                  <input type="hidden" name="medicamentoId" value={med.medicamentoId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar "${med.nombre}"?`)) e.preventDefault();
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
