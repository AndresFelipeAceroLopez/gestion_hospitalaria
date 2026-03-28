/**
 * @file src/modules/formulas/types.ts
 * @description Tipos de dominio para el modulo de Formulas Medicas
 */

import type { Tratamiento, TratamientoConRelaciones } from "../tratamientos/types";
import type { Medicamento } from "../medicamentos/types";

export interface Formula {
  formulaId: number;
  tratamientoId: number;
  fecha: string;
}

export interface DetalleFormula {
  detalleId: number;
  formulaId: number;
  medicamentoId: number;
  posologia: string;
  presentacion: string;
  periodicidadUso: string;
  periodoUso: string;
}

/** Detalle de formula con medicamento relacionado */
export interface DetalleFormulaConRelaciones extends DetalleFormula {
  medicamento: Medicamento;
}

/** Formula con datos relacionados profundos */
export interface FormulaConRelaciones extends Formula {
  tratamiento: TratamientoConRelaciones;
  detalles?: DetalleFormulaConRelaciones[];
}

export type CreateFormulaDTO = Omit<Formula, "formulaId">;
export type UpdateFormulaDTO = Partial<CreateFormulaDTO>;

export interface FormulaFilters {
  fecha?: string;
  tratamientoId?: number;
}
