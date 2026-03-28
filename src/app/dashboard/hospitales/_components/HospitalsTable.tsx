"use client";

import type { Hospital } from "../../../../modules/hospitales/types";

interface Props {
  hospitals: Hospital[];
}

export function HospitalsTable({ hospitals }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">NIT</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Dirección</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {hospitals.map((hospital, index) => (
            <tr key={`h-${hospital.hospitalId ?? index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{hospital.nombre}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.nit}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.direccion}</td>
              <td className="px-4 py-3 text-gray-600">{hospital.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
