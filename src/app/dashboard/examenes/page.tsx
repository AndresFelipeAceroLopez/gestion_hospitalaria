import { OrdenExamenRepository } from "@modules/examenes/examen.repository";
import { OrdenExamenService } from "@modules/examenes/examen.service";
import { createServerSupabaseClient } from "@lib/supabase/server";
import { ExamenesTable } from "./_components/ExamenesTable";
import { ExamenFormModal } from "./_components/ExamenFormModal";

export const metadata = {
  title: "Exámenes | Sistema de Gestión Hospitalaria",
};

const service = new OrdenExamenService(new OrdenExamenRepository());

export default async function ExamenesPage() {
  const supabase = await createServerSupabaseClient();

  const [result, { data: visitasRaw }] = await Promise.all([
    service.getAll(),
    supabase
      .from("visitas")
      .select("visitaid, fecha, hora, pacientes!pacienteid(nombre, apellido)")
      .order("fecha", { ascending: false }),
  ]);

  if (!result.success) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h2 className="text-red-700 font-semibold">Error al cargar exámenes</h2>
        <p className="text-red-600 text-sm mt-1">{result.error}</p>
      </div>
    );
  }

  const examenes = result.data || [];
  const visitas = (visitasRaw ?? []).map((v: any) => ({
    visitaId: v.visitaid as string,
    fecha: v.fecha as string,
    hora: v.hora as string,
    pacienteNombre: `${v.pacientes?.nombre ?? ""} ${v.pacientes?.apellido ?? ""}`.trim() || "—",
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Examen</h1>
          <p className="text-sm text-gray-500 mt-1">
            {examenes.length} orden{examenes.length !== 1 ? "es" : ""} registrada{examenes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ExamenFormModal mode="create" visitas={visitas} />
      </div>

      {examenes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No hay órdenes de examen registradas</p>
          <p className="text-sm mt-1">Haz clic en "Nueva Orden" para agregar una.</p>
        </div>
      ) : (
        <ExamenesTable examenes={examenes} />
      )}
    </div>
  );
}
