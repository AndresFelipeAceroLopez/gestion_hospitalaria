import { FormulaRepository } from "@modules/formulas/formula.repository";
import { FormulaService } from "@modules/formulas/formula.service";
import { FormulasTable } from "./_components/FormulasTable";
import { FormulaFormModal } from "./_components/FormulaFormModal";

export const metadata = {
  title: "Fórmulas | Sistema de Gestión Hospitalaria",
};

const service = new FormulaService(new FormulaRepository());

export default async function FormulasPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar fórmulas</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const formulas = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fórmulas Médicas</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formulas.length} fórmula{formulas.length !== 1 ? "s" : ""} registrada{formulas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <FormulaFormModal mode="create" />
      </div>

      {formulas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay fórmulas registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Fórmula" para agregar una.</p>
        </div>
      ) : (
        <FormulasTable formulas={formulas} />
      )}
    </div>
  );
}
