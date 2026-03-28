import { TratamientoRepository } from "@modules/tratamientos/tratamiento.repository";
import { TratamientoService } from "@modules/tratamientos/tratamiento.service";
import { TratamientosTable } from "./_components/TratamientosTable";
import { TratamientoFormModal } from "./_components/TratamientoFormModal";

export const metadata = {
  title: "Tratamientos | Sistema de Gestión Hospitalaria",
};

const service = new TratamientoService(new TratamientoRepository());

export default async function TratamientosPage() {
  const result = await service.getAll();

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar tratamientos</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const tratamientos = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tratamientos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tratamientos.length} tratamiento{tratamientos.length !== 1 ? "s" : ""} registrado{tratamientos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <TratamientoFormModal mode="create" />
      </div>

      {tratamientos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay tratamientos registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Tratamiento" para agregar uno.</p>
        </div>
      ) : (
        <TratamientosTable tratamientos={tratamientos} />
      )}
    </div>
  );
}
