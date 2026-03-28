import { EspecialidadRepository } from "@modules/especialidades/especialidad.repository";
import { EspecialidadService } from "@modules/especialidades/especialidad.service";
import { EspecialidadesTable } from "./_components/EspecialidadesTable";
import { EspecialidadFormModal } from "./_components/EspecialidadFormModal";

export const metadata = {
  title: "Especialidades | Sistema de Gestión Hospitalaria",
};

const service = new EspecialidadService(new EspecialidadRepository());

export default async function EspecialidadesPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar especialidades</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const especialidades = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Especialidades</h1>
          <p className="text-sm text-gray-500 mt-1">
            {especialidades.length} especialidad{especialidades.length !== 1 ? "es" : ""} registrada{especialidades.length !== 1 ? "s" : ""}
          </p>
        </div>
        <EspecialidadFormModal mode="create" />
      </div>

      {especialidades.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay especialidades registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Especialidad" para agregar una.</p>
        </div>
      ) : (
        <EspecialidadesTable especialidades={especialidades} />
      )}
    </div>
  );
}
