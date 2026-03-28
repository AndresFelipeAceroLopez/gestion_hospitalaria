/**
 * @file src/modules/incapacidades/types.ts
 * @description Tipos de dominio para el modulo de Incapacidades
 */

import type { Tratamiento, TratamientoConRelaciones } from "../tratamientos/types";

export interface Incapacidad {
  incapacidadId: number;
  fecha: string;
  tratamientoId: number;
}

/** Incapacidad con datos relacionados profundos */
export interface IncapacidadConRelaciones extends Incapacidad {
  tratamiento: TratamientoConRelaciones;
}

export type CreateIncapacidadDTO = Omit<Incapacidad, "incapacidadId">;
export type UpdateIncapacidadDTO = Partial<CreateIncapacidadDTO>;

export interface IncapacidadFilters {
  fecha?: string;
  tratamientoId?: number;
}
