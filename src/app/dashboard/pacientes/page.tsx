import { PacienteRepository } from "@modules/pacientes/paciente.repository";
import { PacienteService } from "@modules/pacientes/paciente.service";
import { PacientesTable } from "./_components/PacientesTable";
import { PacienteFormModal } from "./_components/PacienteFormModal";

export const metadata = {
  title: "Pacientes | Sistema de Gestión Hospitalaria",
};

const service = new PacienteService(new PacienteRepository());

export default async function PacientesPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar pacientes</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const pacientes = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""} registrado{pacientes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <PacienteFormModal mode="create" />
      </div>

      {pacientes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay pacientes registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Paciente" para agregar uno.</p>
        </div>
      ) : (
        <PacientesTable pacientes={pacientes} />
      )}
    </div>
  );
}
