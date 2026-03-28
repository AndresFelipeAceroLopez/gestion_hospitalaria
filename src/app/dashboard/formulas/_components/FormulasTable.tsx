"use client";

import type { Formula } from "@modules/formulas/types";
import { deleteFormulaAction } from "@modules/formulas/formula.actions";
import { formatDate } from "@/src/lib/utils/utils";

interface Props {
  formulas: Formula[];
}

export function FormulasTable({ formulas }: Props) {
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
          {formulas.map((formula, index) => (
            <tr key={`f-${formula.formulaId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-400 text-xs">{formula.formulaId}</td>
              <td className="px-4 py-3 text-gray-600">{formula.tratamientoId}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(formula.fecha)}</td>
              <td className="px-4 py-3 text-right">
                <form action={deleteFormulaAction.bind(null, null)}>
                  <input type="hidden" name="formulaId" value={formula.formulaId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar fórmula #${formula.formulaId}?`)) e.preventDefault();
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
