import Link from "next/link";
import { VisitaRepository } from "@modules/visitas/visita.repository";
import { VisitaService } from "@modules/visitas/visita.service";
import { VisitasTable } from "./_components/VisitasTable";

export const metadata = {
  title: "Visitas | Sistema de Gestión Hospitalaria",
};

const service = new VisitaService(new VisitaRepository());

export default async function VisitasPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar visitas</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const visitas = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitas Médicas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {visitas.length} visita{visitas.length !== 1 ? "s" : ""} registrada{visitas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/visitas/nueva"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          Nueva Visita
        </Link>
      </div>

      {visitas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay visitas registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Visita" para registrar una.</p>
        </div>
      ) : (
        <VisitasTable visitas={visitas} />
      )}
    </div>
  );
}
