/**
 * @file src/modules/examenes/types.ts
 * @description Tipos de dominio para el modulo de Examenes
 */

import type { Visita } from "../visitas/types";

export interface OrdenExamen {
  ordenExamenId: number;
  visitaId: number;
  fecha: string;
}

export interface DetalleExamen {
  detalleExamenId: number;
  ordenExamenId: number;
  nombreExamen: string;
  tipoExamen: string;
  indicaciones: string;
}

/** Orden de examen con datos relacionados */
export interface OrdenExamenConRelaciones extends OrdenExamen {
  visita: Visita;
  detalles?: DetalleExamen[];
}

export type CreateOrdenExamenDTO = Omit<OrdenExamen, "ordenExamenId">;
export type UpdateOrdenExamenDTO = Partial<CreateOrdenExamenDTO>;

export interface OrdenExamenFilters {
  fecha?: string;
  visitaId?: number;
}
