import { z } from "zod";

/**
 * @file src/modules/motivosvisitas/motivo.visita.schema.ts
 */

export const motivoVisitaSchema = z.object({
  motivoId: z.number().int().positive().optional(),
  descripcion: z.string().min(1),
});

export const createMotivoVisitaSchema = motivoVisitaSchema.omit({ motivoId: true });
export const updateMotivoVisitaSchema = motivoVisitaSchema.partial();
