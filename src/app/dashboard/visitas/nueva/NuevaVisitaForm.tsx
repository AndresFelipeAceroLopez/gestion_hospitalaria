"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createVisitaAction } from "@modules/visitas/visita.actions";

interface PacienteOption { pacienteId: number; nombre: string; apellido: string; }
interface MedicoOption  { medicoId: number;  nombre: string; apellido: string; }

interface Props {
  pacientes: PacienteOption[];
  medicos: MedicoOption[];
}

export default function NuevaVisitaForm({ pacientes, medicos }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createVisitaAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {/* SECCIÓN 1: Datos de la consulta */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
          Datos de la Consulta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente *
            </label>
            <select
              name="pacienteId"
              required
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="" disabled>Seleccione un paciente</option>
              {pacientes.map((p) => (
                <option key={p.pacienteId} value={p.pacienteId}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
            {state?.errors?.pacienteId && (
              <p className="text-red-500 text-xs mt-1">{state.errors.pacienteId[0]}</p>
            )}
          </div>

          {/* Médico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Médico *
            </label>
            <select
              name="medicoId"
              required
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="" disabled>Seleccione un médico</option>
              {medicos.map((m) => (
                <option key={m.medicoId} value={m.medicoId}>
                  Dr. {m.nombre} {m.apellido}
                </option>
              ))}
            </select>
            {state?.errors?.medicoId && (
              <p className="text-red-500 text-xs mt-1">{state.errors.medicoId[0]}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              name="fecha"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora *
            </label>
            <input
              name="hora"
              type="time"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Diagnóstico y Motivo */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
          Diagnóstico y Motivo
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de consulta *
            </label>
            <textarea
              name="motivoConsulta"
              rows={3}
              required
              placeholder="Describa el motivo de la consulta..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {state?.errors?.motivoConsulta && (
              <p className="text-red-500 text-xs mt-1">{state.errors.motivoConsulta[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnóstico
            </label>
            <textarea
              name="diagnostico"
              rows={3}
              placeholder="Describa el diagnóstico del paciente..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Signos Vitales */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-green-700 mb-4 pb-2 border-b border-gray-100">
          Signos Vitales
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Frec. Cardiaca (bpm)</label>
            <input name="frecuenciaCardiaca" type="number" min="30" max="300" placeholder="72"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Presión Arterial</label>
            <input name="presionArterial" type="text" placeholder="120/80"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Frec. Respiratoria (/min)</label>
            <input name="frecuenciaRespiratoria" type="number" min="5" max="60" placeholder="16"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Temperatura (°C)</label>
            <input name="temperatura" type="number" min="32" max="45" step="0.1" placeholder="36.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Saturación O₂ (%)</label>
            <input name="saturacionOxigeno" type="number" min="0" max="100" step="0.1" placeholder="98.0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </section>

      {state && !state.success && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm space-y-1">
          <p className="font-medium">{state.message}</p>
          {state.errors && Object.entries(state.errors).map(([field, msgs]) =>
            msgs ? <p key={field}>• {(msgs as string[])[0]}</p> : null
          )}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          {state.message}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
          {isPending ? "Registrando..." : "Registrar Visita"}
        </button>
      </div>
    </form>
  );
}
