import { IncapacidadRepository } from "@modules/incapacidades/incapacidad.repository";
import { IncapacidadService } from "@modules/incapacidades/incapacidad.service";
import { IncapacidadesTable } from "./_components/IncapacidadesTable";
import { IncapacidadFormModal } from "./_components/IncapacidadFormModal";

export const metadata = {
  title: "Incapacidades | Sistema de Gestión Hospitalaria",
};

const service = new IncapacidadService(new IncapacidadRepository());

export default async function IncapacidadesPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar incapacidades</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const incapacidades = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incapacidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            {incapacidades.length} incapacidad{incapacidades.length !== 1 ? "es" : ""} registrada{incapacidades.length !== 1 ? "s" : ""}
          </p>
        </div>
        <IncapacidadFormModal mode="create" />
      </div>

      {incapacidades.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay incapacidades registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Incapacidad" para agregar una.</p>
        </div>
      ) : (
        <IncapacidadesTable incapacidades={incapacidades} />
      )}
    </div>
  );
}
