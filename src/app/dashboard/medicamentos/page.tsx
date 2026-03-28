import { MedicamentoRepository } from "@modules/medicamentos/medicamento.repository";
import { MedicamentoService } from "@modules/medicamentos/medicamento.service";
import { MedicamentosTable } from "./_components/MedicamentosTable";
import { MedicamentoFormModal } from "./_components/MedicamentoFormModal";

export const metadata = {
  title: "Medicamentos | Sistema de Gestión Hospitalaria",
};

const service = new MedicamentoService(new MedicamentoRepository());

export default async function MedicamentosPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar medicamentos</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const medicamentos = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {medicamentos.length} medicamento{medicamentos.length !== 1 ? "s" : ""} registrado{medicamentos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <MedicamentoFormModal mode="create" />
      </div>

      {medicamentos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay medicamentos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Medicamento" para agregar uno.</p>
        </div>
      ) : (
        <MedicamentosTable medicamentos={medicamentos} />
      )}
    </div>
  );
}
