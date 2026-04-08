/**
 * @file src/modules/incapacidades/types.ts
 * @description Tipos de dominio para el modulo de Incapacidades
 */

export interface Incapacidad {
  incapacidadId: string;
  fecha: string;
  tratamientoId: string;
}

/** Incapacidad con datos relacionados profundos */
export interface IncapacidadConRelaciones extends Incapacidad {
  pacienteNombre: string;
  visitaFecha: string;
  visitaHora: string;
}

export type CreateIncapacidadDTO = Omit<Incapacidad, "incapacidadId">;
export type UpdateIncapacidadDTO = Partial<CreateIncapacidadDTO>;

export interface IncapacidadFilters {
  fecha?: string;
  tratamientoId?: string;
}
