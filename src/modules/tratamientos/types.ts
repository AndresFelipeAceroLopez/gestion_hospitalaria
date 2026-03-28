/**
 * @file src/modules/tratamientos/types.ts
 * @description Tipos de dominio para el modulo de Tratamientos
 */

import type { Visita } from "../visitas/types";

export interface Tratamiento {
  tratamientoId: number;
  visitaId: number;
  fechaInicio: string;
  fechaFin: string;
}

/** Tratamiento con datos relacionados */
export interface TratamientoConRelaciones extends Tratamiento {
  visita: Visita;
}

export type CreateTratamientoDTO = Omit<Tratamiento, "tratamientoId">;
export type UpdateTratamientoDTO = Partial<CreateTratamientoDTO>;

export interface TratamientoFilters {
  visitaId?: number;
  fechaInicio?: string;
}
