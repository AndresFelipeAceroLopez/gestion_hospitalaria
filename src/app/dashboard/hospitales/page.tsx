// src/app/dashboard/hospitales/page.tsx
import { HospitalRepository } from "../../../modules/hospitales/hospital.repository";
import { HospitalService } from "../../../modules/hospitales/hospital.service";
import { HospitalsTable } from "./_components/HospitalsTable";
import { HospitalFormModal } from "./_components/HospitalFormModal";

// Metadata de la pagina (SEO)
export const metadata = {
  title: "Hospitales | Sistema de Gestión Hospitalaria",
  description: "Listado y gestión de hospitales",
};

// Instanciar servicio (en producción usar DI container)
const hospitalService = new HospitalService(new HospitalRepository());

export default async function HospitalsPage() {
  // Obtener datos en el servidor (SIN useState, SIN useEffect)
  const result = await hospitalService.getAll();

  // Manejo de error del servidor
  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar hospitales</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const hospitals = result.data || [];

  return (
    <div className="space-y-6">
      {/* Cabecera de la página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospitales</h1>
          <p className="text-sm text-gray-500 mt-1">
            {hospitals.length} hospital{hospitals.length !== 1 ? "es" : ""} registrados
          </p>
        </div>

        {/* Boton para abrir el modal de creacion (Client Component) */}
        <HospitalFormModal mode="create" />
      </div>

      {/* Tabla de hospitales */}
      {hospitals.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay hospitales registrados</p>
          <p className="text-sm mt-1">Haz clic en "Nuevo Hospital" para agregar uno.</p>
        </div>
      ) : (
        <HospitalsTable hospitals={hospitals} />
      )}
    </div>
  );
}