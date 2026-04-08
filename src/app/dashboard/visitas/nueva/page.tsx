import { createServerSupabaseClient } from "@lib/supabase/server";
import NuevaVisitaForm from "./NuevaVisitaForm";

export const metadata = { title: "Nueva Visita | Sistema de Gestión Hospitalaria" };

export default async function NuevaVisitaPage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: pacientesRaw }, { data: medicosRaw }, { data: motivosRaw }] = await Promise.all([
    supabase.from("pacientes").select("pacienteid, nombre, apellido").order("apellido"),
    supabase.from("medicos").select("medicoid, nombre, apellido").order("apellido"),
    supabase.from("motivosvisitas").select("motivoid, descripcion").order("descripcion"),
  ]);

  const pacientes = (pacientesRaw ?? []).map((p) => ({
    pacienteId: p.pacienteid,
    nombre:     p.nombre,
    apellido:   p.apellido,
  }));

  const medicos = (medicosRaw ?? []).map((m) => ({
    medicoId: m.medicoid,
    nombre:   m.nombre,
    apellido: m.apellido,
  }));

  const motivos = (motivosRaw ?? []).map((mv: any) => ({
    motivoId:    mv.motivoid,
    descripcion: mv.descripcion as string,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Registrar Nueva Visita Médica
      </h1>
      <NuevaVisitaForm pacientes={pacientes} medicos={medicos} motivos={motivos} />
    </div>
  );
}
