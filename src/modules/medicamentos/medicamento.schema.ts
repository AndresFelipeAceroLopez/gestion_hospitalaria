import { z } from "zod";

/**
 * @file src/modules/medicamentos/medicamento.schema.ts
 */

export const medicamentoSchema = z.object({
  medicamentoId: z.number().int().positive().optional(),
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  cantidad: z.number().int().min(0),
  unidades: z.string().min(1),
  prescripcion: z.string().min(1),
});

export const createMedicamentoSchema = medicamentoSchema.omit({ medicamentoId: true });
export const updateMedicamentoSchema = medicamentoSchema.partial();
