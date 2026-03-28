/**
 * @file src/modules/motivosvisitas/types.ts
 * @description Tipos de dominio para el modulo de Motivos de Visita
 */

export interface MotivoVisita {
  motivoId: number;
  descripcion: string;
}

export type CreateMotivoVisitaDTO = Omit<MotivoVisita, "motivoId">;
export type UpdateMotivoVisitaDTO = Partial<CreateMotivoVisitaDTO>;

export interface MotivoVisitaFilters {
  descripcion?: string;
}
