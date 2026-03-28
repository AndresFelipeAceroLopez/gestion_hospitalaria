/**
 * @file src/modules/visitas/types.ts
 * @description Tipos para el modulo de Visitas
 */

import type { Paciente } from "../pacientes/types";
import type { Medico } from "../medicos/types";

export interface Visita {
  visitaId: number;
  pacienteId: number;
  medicoId: number;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM"
}

export interface DetalleVisita {
  detalleVisitaId: number;
  visitaId: number;
  motivoId: number;
  diagnostico: string;
}

export interface SignoVital {
  signoVitalId: number;
  visitaId: number;
  frecuenciaCardiaca: number;
  presionArterial: string;
  frecuenciaRespiratoria: number;
  temperatura: number;
  saturacionOxigeno: number;
}

/** Visita completa con todos sus datos relacionados */
export interface VisitaComplete extends Visita {
  paciente: { nombre: string; apellido: string; telefono: string };
  medico: { nombre: string; apellido: string; especialidad: string };
  detalle?: DetalleVisita & { motivoDescripcion: string };
  signosVitales?: Omit<SignoVital, "signoVitalId" | "visitaId">;
}

/** Visita con relaciones de dominio completas */
export interface VisitaConRelaciones extends Visita {
  paciente: Paciente;
  medico: Medico;
}

export type CreateVisitaDTO = Omit<Visita, "visitaId">;
export type UpdateVisitaDTO = Partial<CreateVisitaDTO>;

export interface VisitaFilters {
  pacienteId?: number;
  medicoId?: number;
  fecha?: string;
}