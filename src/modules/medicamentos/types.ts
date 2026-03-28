/**
 * @file src/modules/medicamentos/types.ts
 * @description Tipos de dominio para el modulo de Medicamentos
 */

export interface Medicamento {
  medicamentoId: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  unidades: string;
  prescripcion: string;
}

export type CreateMedicamentoDTO = Omit<Medicamento, "medicamentoId">;
export type UpdateMedicamentoDTO = Partial<CreateMedicamentoDTO>;

export interface MedicamentoFilters {
  nombre?: string;
}
