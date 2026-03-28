"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { createBrowserSupabaseClient } from "@lib/supabase/client";

interface VisitaRow {
  visitaId: number;
  fecha: string;
  hora: string;
  paciente: { nombre: string; apellido: string } | null;
  medico: { nombre: string; apellido: string } | null;
}

interface Props {
  initialVisitas: VisitaRow[];
}

function getNombrePaciente(v: VisitaRow) {
  if (v.paciente?.nombre) return `${v.paciente.nombre} ${v.paciente.apellido}`;
  return "Paciente sin nombre";
}

function getNombreMedico(v: VisitaRow) {
  if (v.medico?.nombre) return `${v.medico.nombre} ${v.medico.apellido}`;
  return "Médico sin nombre";
}

function formatFecha(fecha: string) {
  try {
    return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
  } catch {
    return fecha;
  }
}

export function RealtimeVisitasDashboard({ initialVisitas }: Props) {
  const [visitas, setVisitas] = useState<VisitaRow[]>(initialVisitas);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel("dashboard:visitas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visitas" },
        async (payload) => {
          const raw = payload.new as Record<string, unknown>;

          // Obtener nombres del paciente y médico con una query separada
          const { data } = await supabase
            .from("visitas")
            .select(`
              visitaid, fecha, hora,
              pacientes!pacienteid(nombre, apellido),
              medicos!medicoid(nombre, apellido)
            `)
            .eq("visitaid", raw.visitaid as number)
            .single();

          if (data) {
            const nueva: VisitaRow = {
              visitaId: data.visitaid as number,
              fecha: data.fecha as string,
              hora: data.hora as string,
              paciente: (data.pacientes as { nombre: string; apellido: string }) ?? null,
              medico: (data.medicos as { nombre: string; apellido: string }) ?? null,
            };
            setVisitas((prev) => [nueva, ...prev.slice(0, 9)]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "visitas" },
        (payload) => {
          const id = (payload.old as Record<string, unknown>).visitaid as number;
          setVisitas((prev) => prev.filter((v) => v.visitaId !== id));
        }
      )
      .subscribe((status: string) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Visitas Recientes</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-xs text-gray-500">
            {isConnected ? "En tiempo real" : "Conectando..."}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {visitas.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No hay visitas registradas
          </div>
        ) : (
          visitas.map((visita, index) => (
            <div
              key={`v-${visita.visitaId ?? index}`}
              className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getNombrePaciente(visita)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Dr. {getNombreMedico(visita)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400">{formatFecha(visita.fecha)}</span>
                <p className="text-xs text-gray-300 mt-0.5">{visita.hora?.slice(0, 5)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
