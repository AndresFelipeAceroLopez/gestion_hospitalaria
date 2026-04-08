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

export interface DetalleFormulaConRelaciones extends DetalleFormula {
  medicamento: Medicamento;
}

export interface FormulaConRelaciones extends Formula {
  pacienteNombre: string;
  visitaFecha: string;
  visitaHora: string;
  detalles?: DetalleFormulaConRelaciones[];
}

export type CreateFormulaDTO = Omit<Formula, "formulaId">;
export type UpdateFormulaDTO = Partial<CreateFormulaDTO>;

export interface FormulaFilters {
  fecha?: string;
  tratamientoId?: number; // 🔥 clave
}