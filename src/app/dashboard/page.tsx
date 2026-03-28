/**
 * @file src/app/(dashboard)/page.tsx
 * @description Página principal del dashboard con métricas del sistema.
 * Server Component que carga KPIs en paralelo para máxima velocidad.
 */

import { createServerSupabaseClient } from "@lib/supabase/server";
import { RealtimeVisitasDashboard } from "@components/ui/RealtimeVisitasDashboard";

export const metadata = {
  title: "Dashboard | Sistema de Gestión Hospitalaria",
};

/** Carga las estadísticas del dashboard en paralelo */
async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();
  const hoy = new Date().toISOString().split("T")[0];

  // Promise.all ejecuta TODAS las queries en PARALELO
  // Mucho más rápido que ejecutarlas en secuencia
  const [
    pacientesResult,
    visitasHoyResult,
    medicosResult,
    hospitalesResult,
    visitasRecientesResult,
  ] = await Promise.all([
    supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("visitas")
      .select("*", { count: "exact", head: true })
      .eq("fecha", hoy),
    supabase
      .from("medicos")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("hospitales")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("visitas")
      .select(`
        visitaid,
        fecha,
        hora,
        pacientes!pacienteid (
          nombre,
          apellido
        ),
        medicos!medicoid (
          nombre,
          apellido
        )
      `)
      .order("fecha", { ascending: false })
      .order("hora", { ascending: false })
      .limit(10),
  ]);

  return {
    totalPacientes: pacientesResult.count || 0,
    visitasHoy: visitasHoyResult.count || 0,
    totalMedicos: medicosResult.count || 0,
    totalHospitales: hospitalesResult.count || 0,
    visitasRecientes: (visitasRecientesResult.data || []).map((v: any) => ({
      visitaId: v.visitaid,
      fecha: v.fecha,
      hora: v.hora,
      paciente: v.pacientes ?? null,
      medico: v.medicos ?? null,
    })),
  };
}

// Tarjeta de KPI
function StatCard({ 
  title, 
  value, 
  color 
}: { 
  title: string;
  value: number;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const colors = {
    green: "text-green-600 bg-green-50 border-green-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
    orange: "text-orange-600 bg-orange-50 border-orange-200",
  };

  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-2">
        {value.toLocaleString("es-CO")}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Sistema de Gestión Hospitalaria
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pacientes" 
          value={stats.totalPacientes} 
          color="green" 
        />
        <StatCard 
          title="Visitas Hoy" 
          value={stats.visitasHoy} 
          color="blue" 
        />
        <StatCard 
          title="Médicos" 
          value={stats.totalMedicos} 
          color="purple" 
        />
        <StatCard 
          title="Hospitales" 
          value={stats.totalHospitales} 
          color="orange" 
        />
      </div>

      {/* Grid de widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitas recientes en tiempo real (Client Component) */}
        <RealtimeVisitasDashboard
          initialVisitas={stats.visitasRecientes}
        />
        
        {/* Aquí puedes agregar más widgets en el futuro */}
        {/* 
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Próximas Citas
          </h2>
          <p className="text-gray-500">Próximamente...</p>
        </div>
        */}
      </div>
    </div>
  );
}