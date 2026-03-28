import { MedicoRepository } from "@modules/medicos/medico.repository";
import { MedicoService } from "@modules/medicos/medico.service";
import { MedicosTable } from "./_components/MedicosTable";
import { MedicoFormModal } from "./_components/MedicoFormModal";

export const metadata = {
  title: "Médicos | Sistema de Gestión Hospitalaria",
};

const service = new MedicoService(new MedicoRepository());

export default async function MedicosPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar médicos</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const medicos = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicos.length} médico{medicos.length !== 1 ? "s" : ""} registrado{medicos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <MedicoFormModal mode="create" />
      </div>

      {medicos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay médicos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Médico" para agregar uno.</p>
        </div>
      ) : (
        <MedicosTable medicos={medicos} />
      )}
    </div>
  );
}
