"use client";

import type { Paciente } from "@modules/pacientes/types";
import { deletePacienteAction } from "@modules/pacientes/paciente.actions";
import { getFullName, formatDate, calcularEdad } from "@/src/lib/utils/utils";

interface Props {
  pacientes: Paciente[];
}

export function PacientesTable({ pacientes }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha Nac.</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Edad</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Sexo</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Correo</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pacientes.map((pac, index) => (
            <tr key={`p-${pac.pacienteId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">
                {getFullName(pac.nombre, pac.apellido)}
              </td>
              <td className="px-4 py-3 text-gray-600">{formatDate(pac.fechaNacimiento)}</td>
              <td className="px-4 py-3 text-gray-600">{calcularEdad(pac.fechaNacimiento)} años</td>
              <td className="px-4 py-3 text-gray-600">{pac.sexo}</td>
              <td className="px-4 py-3 text-gray-600">{pac.telefono}</td>
              <td className="px-4 py-3 text-gray-600">{pac.correoElectronico}</td>
              <td className="px-4 py-3 text-right">
                <form action={deletePacienteAction.bind(null, null)}>
                  <input type="hidden" name="pacienteId" value={pac.pacienteId} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    onClick={(e) => {
                      if (!confirm(`¿Eliminar a ${getFullName(pac.nombre, pac.apellido)}?`)) e.preventDefault();
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
